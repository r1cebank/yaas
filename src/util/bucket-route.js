/**
 * bucket-route
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

import AppSingleton     from './appsingleton';
import Promise          from 'bluebird';
import Routes           from '../routes/routes';
import Wrapper          from './workerwrapper';

/**
 * set bucketroutes
 *
 * @method bucketroute
 * @return {Undefined} Returns nothing
 */

function bucketroute() {

    //  Log tag
    var TAG = "bucketroute";

    //  This instance is shared across the entire app life-cycle
    var sharedInstance = AppSingleton.getInstance();

    //  List all buckets
    sharedInstance.app.get('/', function (req, res) {

        if(sharedInstance.authority.hasRole(req, res, 'bucket:list')) {
            Wrapper.wrapper('bucket:list', req, res);
        }
    });
    //  List all files in bucket
    sharedInstance.app.get('/buckets/:bucket', function (req, res) {
        if(sharedInstance.authority.hasRole(req, res, 'file:list')) {
            Wrapper.wrapper('file:list', req, res);
        }
    });
    //  Setup upload
    sharedInstance.app.post('/buckets/:bucket/upload', sharedInstance.upload.single('file'), function(req, res) {
        if(sharedInstance.authority.hasRole(req, res, 'bucket:upload')) {
            Wrapper.wrapper('bucket:upload', req, res);
        }
    });
    //  Get uploaded file
    sharedInstance.app.get('/buckets/:bucket/:filename', function (req, res) {
        if(sharedInstance.authority.hasRole(req, res, 'file:get')) {
            Wrapper.wrapper('file:get', req, res);
        }

    });
    //  List all versions for file
    sharedInstance.app.get('/buckets/:bucket/:filename/versions', function (req, res) {
        if(sharedInstance.authority.hasRole(req, res, 'version:list')) {
            Wrapper.wrapper('version:list', req, res);
        }
    });
}

export default bucketroute;