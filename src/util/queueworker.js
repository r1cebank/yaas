/**
 * queueworker
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

/*!
 *  Queue Worker handles all the request came to the system, queue the job and work it in background so it
 *  wont block other process from processing
 */

import AppSingleton     from './appsingleton';
import Promise          from 'bluebird';
import Mkdir            from 'mkdirp';
import Kue              from 'kue';
import Routes           from '../routes/routes';
import Generators       from '../routes/generator/routes';


function queueworker() {

    //  Log tag
    var TAG = "queueworker";

    //  This instance is shared across the entire app life-cycle
    var sharedInstance = AppSingleton.getInstance();

    //  Get concurrency for this app
    if(isNaN(sharedInstance.config.concurrency)) {
       sharedInstance.config.concurrency = require('os').cpus().length;
    }

    sharedInstance.queue.process('generator:lorem', sharedInstance.config.concurrency, require('./worker/generator.lorem.js'));
    sharedInstance.queue.process('generator:json', sharedInstance.config.concurrency, require('./worker/generator.json.js'));
    sharedInstance.queue.process('generator:xml', sharedInstance.config.concurrency, require('./worker/generator.xml.js'));


    sharedInstance.queue.on('error', function(err) {
        sharedInstance.L.error(TAG, err);
    });
}

module.exports = queueworker;