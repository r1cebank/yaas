/**
 * Created by r1cebank on 8/30/15.
 */

/*!
 *  This will transform the ysql object into actual database query result
 */

import AppSingleton     from '../../../util/appsingleton';
import Promise          from 'bluebird';
import Fs               from 'fs';
import JPath            from 'jsonpath';
import JsonFile         from 'jsonfile';
import Path             from 'path';
import _                from 'lodash';

//  Old require still using require
var hash = require('json-hash');

function transform(req, file, version) {

    let TAG = 'transform:yaas:sql';

    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve, reject) => {
        // If no param supplied, resolve
        if(_.isEmpty(req)) {
            sharedInstance.L.info(TAG, "no transform options provided.");
            resolve({error: "no options provided"});
        } else {
            //  Needed the version number to enforce the files don't collide.
            req.v = version;
            var filename = Path.join(process.cwd(), sharedInstance.config.server.storage.processed, `${hash.digest(req)}.ysql`);
            //  Needs to delete v to avoid confusions
            delete req.v;
            //  If exists in the system, don't bother processing it
            //  Read this json file
            JsonFile.readFile(file, function(err, obj) {
                if(!err) {
                    //  No error while reading ysql, continue to processing
                    // TODO: write real processing here
                    //  Open a new connection -> cache the connection -> query -> grab the results
                    resolve(obj);
                } else {
                    sharedInstance.L.error(TAG, `error occurred: ${err.toString()}`);
                    resolve({error : err.toString()});
                }
            });
        }
    });
}

export default transform;