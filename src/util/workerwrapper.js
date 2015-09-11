/**
 * workerwrapper
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

/*!
 *  This is the function that wraps the worker into job and include all the helper functions
 */

import AppSingleton     from './appsingleton';
import _                from 'lodash';

function wrapper(work, req, res) {

    //  Log tag
    var TAG = "wrapper";

    //  This instance is shared across the entire app life-cycle
    var sharedInstance = AppSingleton.getInstance();

    var job = sharedInstance.queue.create(work, {
        request: _.extend(req.params || {}, req.query || {}, req.body || {})
    });
    job.on('complete', function(result){
        // avoid sending data after the response has been closed
        sharedInstance.L.verbose(TAG, "job complete");
        if (!res.finished) {
            if(result.type === 'object') {
                //  If it is object, then just send it to as response.
                sharedInstance.L.verbose(TAG, 'sending result as response');
                res.send(result.data);
            } else if (result.type === 'path') {
                //  If it is not, then send as a file.
                sharedInstance.L.verbose(TAG, 'sending result as file');
                res.type(result.mimetype);
                res.sendFile(result.path);
            } else {
                res.status(500).send({error: 'internal error'});
            }

        }
    }).on('failed', function(error){
        sharedInstance.L.verbose(TAG, `job #${job.id} failed`);
        if (!res.finished) {
            res.send({error: error});
        }
    }).on('progress', function(progress){
        sharedInstance.L.verbose(TAG, 'job #' + job.id + ' ' + progress + '% complete');
    });
    job.removeOnComplete(sharedInstance.config.server.autoclean).save( function(err){
        if( !err ) {
            sharedInstance.L.verbose(TAG, `${work} job created ${job.id}`);
        } else {
            sharedInstance.L.error(TAG, `error occurred: ${err.toString()}`);
        }
    });
    return job;
}

export default {wrapper};