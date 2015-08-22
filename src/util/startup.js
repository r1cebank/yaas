/**
 * Created by r1cebank on 8/19/15.
 */

/*!
 *  After bootstrap, all the necessary promises, values are defined in AppSingleton
 *  In startup.js we will begin loading the appropriate routes, settings
 */

import AppSingleton     from './appsingleton';
import Promise          from 'bluebird';
import Routes           from '../routes/routes';

function startup() {

    //  Log tag
    var TAG = "startup";

    //  This instance is shared across the entire app life-cycle
    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve) => {

        //  Setup routes for app

        //  Setup upload
        sharedInstance.app.post('/bucket/:bucket/upload', sharedInstance.upload.single('file'), function(req, res) {
            Routes.upload(req, res).then().catch().done();
        });
        //  Bucket creation path
        sharedInstance.app.post('/bucket', function (req, res) {
            Routes.bucket(req, res).then().catch().done();
        });
        //  Get uploaded file
        sharedInstance.app.get('/:bucket/:filename', function (req, res) {
            Routes.getfile(req, res).then().catch().done();

        });
        resolve({ });
    });

}
export default startup;