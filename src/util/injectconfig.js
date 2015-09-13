/**
 * injectconfig
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

import AppSingleton     from './appsingleton';
import Promise          from 'bluebird';
import Encrypter        from 'object-encrypter';
import Path             from 'path';


/**
 * inject config from environment to singleton
 *
 * @method inject
 * @return {Undefined} Returns nothing
 */
function inject() {

    //  Log tag
    var TAG = "inject";

    //  This instance is shared across the entire app life-cycle
    var sharedInstance = AppSingleton.getInstance();

    //  Get secret from environment and the jwt signed config file
    let SECRET = process.env.SECRET || sharedInstance.config.HMACSecret;
    let CONFIG = process.env.CONFIG;

    //  Replace encryption engine
    sharedInstance.engine = Encrypter(SECRET, {ttl: false});

    //  If config is specified, decrypt the string
    if(CONFIG) {
        var config = sharedInstance.engine.decrypt(CONFIG);
        if(config) {
            sharedInstance.config = config; //  Replace the current config with the one supplied
            sharedInstance.L.verbose(TAG, "decryption success, using config");
            sharedInstance.L.verbose(TAG, `${JSON.stringify(sharedInstance.config)}`);
        } else {
            sharedInstance.L.error(TAG, "decryption failed!");
            process.exit(-1);
        }
    } else {
        sharedInstance.L.verbose(TAG, "no config supplied, using config file");
    }

    // Other environment variables need to inject to config

    //  Replace redis connection settings from environment variables
    sharedInstance.config.redis.host = process.env.REDIS_PORT_6379_TCP_ADDR || sharedInstance.config.redis.host;
    sharedInstance.config.redis.port = process.env.REDIS_PORT_6379_TCP_PORT || sharedInstance.config.redis.port;
    sharedInstance.config.loglevel = process.env.LOG_LEVEL || sharedInstance.config.loglevel;
    sharedInstance.log.transports.console.level = process.env.LOG_LEVEL || sharedInstance.config.loglevel;
    sharedInstance.config.server.storage.database = process.env.DATABASE_PATH || sharedInstance.config.server.storage.database;
    sharedInstance.config.server.storage.dest = process.env.DEST_PATH || sharedInstance.config.server.storage.dest;
    sharedInstance.config.server.storage.processed = process.env.PROCESSED_PATH || sharedInstance.config.server.storage.processed;
    sharedInstance.config.server.storage.relative = process.env.PATH_RELATIVE || sharedInstance.config.server.storage.relative;

    //  If path is relative, get absolute path
    if(sharedInstance.config.server.storage.relative === true) {
        sharedInstance.config.server.storage.dest = Path.join(process.cwd(),
            sharedInstance.config.server.storage.dest);
        sharedInstance.config.server.storage.database = Path.join(process.cwd(),
            sharedInstance.config.server.storage.database);
        sharedInstance.config.server.storage.processed = Path.join(process.cwd(),
            sharedInstance.config.server.storage.processed);
    }


}

export default inject;