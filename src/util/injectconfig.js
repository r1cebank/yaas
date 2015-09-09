/**
 * injectconfig
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

import AppSingleton     from './appsingleton';
import Promise          from 'bluebird';
import Encrypter        from 'object-encrypter';



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
    sharedInstance.config.redis.host = process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1';
    sharedInstance.config.redis.port = process.env.REDIS_PORT_6379_TCP_PORT || 6379;

}

export default inject;