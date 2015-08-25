/**
 * Created by r1cebank on 8/19/15.
 */

/*!
 *  Bootstrap is ran first will set all the necessary things like in appsingleton
 *  loggers, configs and many other things. It is reusable in many other applications
 */

import AppSingleton     from './appsingleton';
import Winston          from 'winston';
import Promise          from 'bluebird';
import NeDB             from 'nedb';
import Mkdir            from 'mkdirp';
import Authority        from '../auth/authority';

function bootstrap () {

    //  Log tag
    var TAG = "bootstrap";

    //  This instance is shared across the entire app life-cycle
    var sharedInstance = AppSingleton.getInstance();

    //  Creating a new shared instance for winston logger
    sharedInstance.Log = new (Winston.Logger)({
        transports: [
            new (Winston.transports.Console)({
                colorize: 'all'
            })
        ]
    });
    sharedInstance.L = {
        info    :   (tag, log) => {sharedInstance.Log.info(`[${tag}] : ${log}`);},
        error   :   (tag, log) => {sharedInstance.Log.error(`[${tag}] : ${log}`);},
        warn    :   (tag, log) => {sharedInstance.Log.warn(`[${tag}] : ${log}`);}
    };

    //  Setup local master db connection here
    sharedInstance.buckets = new NeDB({filename: sharedInstance.config.server.index, autoload: true});
    sharedInstance.L.info(TAG, `${sharedInstance.config.server.buckets} is loaded`);

    //  Promisify functions
    sharedInstance.findBucket = Promise.promisify(sharedInstance.buckets.find, sharedInstance.buckets);
    sharedInstance.insertBucket = Promise.promisify(sharedInstance.buckets.insert, sharedInstance.buckets);

    //  Create all the folder needed for this application
    Mkdir(sharedInstance.config.server.storage.dest);
    Mkdir(sharedInstance.config.server.storage.processed);

    //  Setup authority
    sharedInstance.authority = new Authority(sharedInstance.config.auth.type);
    sharedInstance.auth = sharedInstance.config.auth;

    sharedInstance.L.info(TAG, "Bootstrap complete!");
}

module.exports = bootstrap;
