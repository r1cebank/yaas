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
import DB               from 'tingodb';
import Mkdir            from 'mkdirp';
import Kue              from 'kue';
import UI               from 'kue-ui';
import Authority        from '../auth/authority';
import Config           from '../config/config';
import QueueWorker      from './queueworker';


function bootstrap () {

    //  Log tag
    var TAG = "bootstrap";

    //  This instance is shared across the entire app life-cycle
    var sharedInstance = AppSingleton.getInstance();

    //  Set the config object
    sharedInstance.config = Config;

    //  Creating a new shared instance for winston logger
    sharedInstance.Log = new (Winston.Logger)({
        transports: [
            new (Winston.transports.Console)({
                colorize    : 'all',
                level       : 'verbose'
            })
        ]
    });
    sharedInstance.L = {
        verbose :   (tag, log) => {sharedInstance.Log.verbose(`[${tag}] : ${log}`);},
        info    :   (tag, log) => {sharedInstance.Log.info(`[${tag}] : ${log}`);},
        error   :   (tag, log) => {sharedInstance.Log.error(`[${tag}] : ${log}`);},
        warn    :   (tag, log) => {sharedInstance.Log.warn(`[${tag}] : ${log}`);}
    };

    //  Create a worker queue
    sharedInstance.queue = Kue.createQueue();
    sharedInstance.L.verbose(TAG, 'worker kue created/restored');

    //  Setup kue queue ui
    UI.setup(sharedInstance.config.server.ui);
    sharedInstance.app.use('/api', Kue.app);
    sharedInstance.app.use('/kue', UI.app);

    //  Create all the folder needed for this application
    Mkdir(sharedInstance.config.server.database);
    Mkdir(sharedInstance.config.server.storage.dest);
    Mkdir(sharedInstance.config.server.storage.processed);

    //  Setup local master db connection here
    var Engine = DB();  //  Create a db engine

    //  Create the database for yaas, mongodb compliant
    sharedInstance.buckets = new Engine.Db(sharedInstance.config.server.database, {});
    sharedInstance.L.info(TAG, `${sharedInstance.config.server.database} is loaded`);

    //  Promisify functions

    //  Setup authority
    sharedInstance.authority = new Authority(sharedInstance.config.auth.type, sharedInstance.config.auth);

    //  Set all the queue workers
    QueueWorker();

    sharedInstance.L.info(TAG, "Bootstrap complete!");
}

module.exports = bootstrap;
