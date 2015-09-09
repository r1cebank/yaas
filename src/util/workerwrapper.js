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
            if(typeof file === 'object') {

                //  If it is object, then just send it to as response.
                sharedInstance.L.verbose(TAG, 'sending result as response');
                res.sendFile(result);
            } else {
                res.send(result);
            }
        }
    }).on('failed', function(){
        sharedInstance.L.verbose(TAG, `job #${job.id} failed`);
        if (!res.finished) {
            res.send({error: `job #${job.id} failed`});
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