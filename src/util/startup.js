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
        sharedInstance.app.post('/:bucket/upload', sharedInstance.upload.single('file'), function(req, res) {
            if(sharedInstance.authority.hasRole(req, res, 'bucket:upload')) {
                Routes.upload(req, res).then().catch().done();
            }
        });
        //  Bucket creation path
        sharedInstance.app.post('/bucket', function (req, res) {
            if(sharedInstance.authority.hasRole(req, res, 'bucket:create')) {
                Routes.bucket(req, res).then().catch().done();
            }
        });
        //  List all buckets
        sharedInstance.app.get('/list', function (req, res) {

            /*!
             *  Looks like cannot use as middleware.
             */
            if(sharedInstance.authority.hasRole(req, res, 'yaas:list')) {
                Routes.listbucket(req, res).then().catch().done();
            }
        });
        //  List all files in bucket
        sharedInstance.app.get('/:bucket', function (req, res) {
            if(sharedInstance.authority.hasRole(req, res, 'bucket:list')) {
                Routes.listfile(req, res).then().catch().done();
            }
        });
        //  List all versions for file
        sharedInstance.app.get('/:bucket/:filename/list', function (req, res) {
            if(sharedInstance.authority.hasRole(req, res, 'version:list')) {
                Routes.listversion(req, res).then().catch().done();
            }
        });
        //  Get uploaded file
        sharedInstance.app.get('/:bucket/:filename', function (req, res) {
            if(sharedInstance.authority.hasRole(req, res, 'file:get')) {
                Routes.getfile(req, res).then().catch().done();
            }

        });
        resolve({ });
    });

}
export default startup;
