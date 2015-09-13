/**
 * Created by r1cebank on 8/19/15.
 */

/*!
 *  Bootstrap is ran first will set all the necessary things like in appsingleton
 *  loggers, configs and many other things. It is reusable in many other applications
 */

//  NPM modules
import Multer           from 'multer';
import Winston          from 'winston';
import Promise          from 'bluebird';
import DB               from 'tingodb';
import Mkdir            from 'mkdirp';
import Kue              from 'kue';
import Path             from 'path';
import Encrypter        from 'object-encrypter';

//  Libraries
import AppSingleton     from './appsingleton';
import Authority        from '../auth/authority';
import Config           from '../config/config';
import QueueWorker      from './queueworker';
import Injector         from './injectconfig';
import MulterCore       from './multercore';

/**
 * bootstrap the entire application
 *
 * @method bootstrap
 * @return {Undefined} Returns nothing
 */
function bootstrap () {

    //  Log tag
    var TAG = "bootstrap";

    //  This instance is shared across the entire app life-cycle
    var sharedInstance = AppSingleton.getInstance();

    //  Set the config object
    sharedInstance.config = Config;

    //  Set global encryption engine
    sharedInstance.engine = Encrypter(Config.HMACSecret, {ttl: false});


    //  Creating a new shared instance for winston logger
    sharedInstance.log = new (Winston.Logger)({
        transports: [
            new (Winston.transports.Console)({
                colorize    : 'all',
                level       : Config.loglevel
            })
        ]
    });
    sharedInstance.L = {
        verbose :   (tag, log) => {sharedInstance.log.verbose(`[${tag}] : ${log}`);},
        info    :   (tag, log) => {sharedInstance.log.info(`[${tag}] : ${log}`);},
        error   :   (tag, log) => {sharedInstance.log.error(`[${tag}] : ${log}`);},
        warn    :   (tag, log) => {sharedInstance.log.warn(`[${tag}] : ${log}`);}
    };

    /*!
     *  Run the config injector, if config is set through environment variables, we will load config from jwt
     */
    Injector();

    //  Sign the config
    var token = sharedInstance.engine.encrypt(Config);
    sharedInstance.L.verbose(TAG, token);

    sharedInstance.L.verbose(TAG, "current configuration");
    sharedInstance.L.verbose(TAG, `${JSON.stringify(sharedInstance.config)}`);

    //  Create a worker queue
    sharedInstance.queue = Kue.createQueue({
        redis: sharedInstance.config.redis
    });
    sharedInstance.L.verbose(TAG, 'worker kue created/restored');

    //  If path is relative, get absolute path
    if(sharedInstance.config.server.storage.relative === true) {
        sharedInstance.config.server.storage.dest = Path.join(process.cwd(),
            sharedInstance.config.server.storage.dest);
        sharedInstance.config.server.storage.database = Path.join(process.cwd(),
            sharedInstance.config.server.storage.database);
        sharedInstance.config.server.storage.processed = Path.join(process.cwd(),
            sharedInstance.config.server.storage.processed);
    }


    //  Create all the folder needed for this application
    Mkdir(sharedInstance.config.server.storage.database);
    Mkdir(sharedInstance.config.server.storage.dest);
    Mkdir(sharedInstance.config.server.storage.processed);

    //  Upload instance
    var storage = Multer.diskStorage({
        destination: MulterCore.destination,
        filename: MulterCore.filename
    });
    sharedInstance.upload = Multer({storage});

    //  Setup local master db connection here
    var Engine = DB();  //  Create a db engine

    //  Create the database for yaas, mongodb compliant
    sharedInstance.buckets = new Engine.Db(sharedInstance.config.server.storage.database, {});
    sharedInstance.L.info(TAG, `${sharedInstance.config.server.database} is loaded`);

    //  Promisify functions

    //  Setup authority
    sharedInstance.authority = new Authority(sharedInstance.config.auth.type, sharedInstance.config.auth);

    //  Set all the queue workers
    QueueWorker();


    //  Final step, make sure we exit the app nicely
    process.once('SIGTERM', function (sig) {
        sharedInstance.queue.shutdown(5000, function(err) {
            console.log('Kue shutdown: ', err||'');
            process.exit(0);
        });
    });

    sharedInstance.L.info(TAG, "Bootstrap complete!");
}

module.exports = bootstrap;
