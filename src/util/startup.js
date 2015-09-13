/**
 * Created by r1cebank on 8/19/15.
 */

/*!
 *  After bootstrap, all the necessary promises, values are defined in AppSingleton
 *  In startup.js we will begin loading the appropriate routes, settings
 */

import AppSingleton     from './appsingleton';
import Promise          from 'bluebird';
import BucketRoute      from './bucket-route.js';
import GeneratorRoute   from './generator-route.js';

/**
 * startup the application, setting the proper path
 *
 * @comment use startup after bootstrap
 * @method startup
 * @return {Promise} Returns a promise that will be resolved when startup is complete
 */
function startup() {

    //  Log tag
    var TAG = "startup";

    //  This instance is shared across the entire app life-cycle
    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve) => {

        //  Setup routes for app
        BucketRoute();
        GeneratorRoute();


        resolve({ });
    });

}
export default startup;
