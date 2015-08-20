/**
 * Created by r1cebank on 8/19/15.
 */

import AppSingleton     from './appsingleton';
import Winston          from 'winston';

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


    sharedInstance.L.info(TAG, "Bootstrap complete!");
}

module.exports = bootstrap;
