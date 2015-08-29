/**
 * Created by r1cebank on 8/28/15.
 */

/*!
 *  This will transform the images and output
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

    let TAG = 'transform:application:json';

    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve, reject) => {
        // If no param supplied, resolve
        if(_.isEmpty(req)) {
            sharedInstance.L.info(TAG, "no transform options provided.");
            resolve(file);
        } else {
            //  Needed the version number to enforce the files don't collide.
            req.v = version;
            var filename = Path.join(process.cwd(), sharedInstance.config.server.storage.processed, `${hash.digest(req)}.json`);
            //  Needs to delete v to avoid confusions
            delete req.v;
            Fs.stat(filename, (err, stat) => {
                //  If exists in the system, don't bother processing it
                if (err) {
                    //  Read this json file
                    JsonFile.readFile(file, function(err, obj) {
                        if(!err) {

                            //  This might be used if we have more than one transform params
                            var result = _.clone(obj);
                            for(var key of Object.keys(req)) {
                                switch(key) {
                                    case "query":
                                        result = JPath.query(result, req.query);
                                        break;
                                    default:
                                        sharedInstance.L.warn(TAG, `unsupported action ${key}.`);
                                }
                            }
                            //  Finally write the file
                            JsonFile.writeFile(filename, result, function (err) {
                                if(!err) {
                                    resolve(filename);
                                } else {
                                    sharedInstance.L.error(TAG, `error occured: ${err.toString()}`);
                                    resolve(file);
                                }
                            });
                        } else {
                            sharedInstance.L.error(TAG, `error occured: ${err.toString()}`);
                            resolve(file);
                        }
                    });
                } else {
                    sharedInstance.L.info(TAG, 'skip processing since file exists');
                    resolve(filename);
                }
            });
        }
    });
}

export default transform;