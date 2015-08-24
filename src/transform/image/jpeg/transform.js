/**
 * Created by r1cebank on 8/23/15.
 */

/*!
 *  This will transform the images and output
 */

import AppSingleton     from '../../../util/appsingleton';
import Promise          from 'bluebird';
import Fs               from 'fs';
import lwip             from 'lwip';
import Path             from 'path';
import _                from 'lodash';

//  Old require still using require
var hash = require('json-hash');

function transform(req, file, version) {

    let TAG = 'transform:image:jpeg';

    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve, reject) => {

        // If no param supplied, resolve
        if(_.isEmpty(req)) {
            resolve(file);
        } else {
            lwip.open(file, function (err, image) {
                if(err) {
                    //  If there is error, return the original file
                    resolve(file);
                }
                var batch = image.batch();

                //  Needed the version number to enforce the files don't colide.
                req.v = version;
                var filename = Path.join(process.cwd(), sharedInstance.config.server.storage.processed, `${hash.digest(req)}.jpeg`);
                //  Needs to delete v to avoid confusions
                delete req.v;
                //  If exists in the system, dont bother processing it
                if(!Fs.existsSync(filename)) {
                    //  All processing goes here.
                    for(var key of Object.keys(req)) {
                        try {
                            switch(key) {
                                case "scale":
                                    //  Scale the image
                                    if(!isNaN(req[key], 10)) {
                                        batch = batch.scale(Number(req[key]));
                                    }
                                    break;
                                case "crop":
                                    //  Crop the image
                                    if(JSON.parse(req[key]) instanceof Array) {
                                        let array = JSON.parse(req[key]);
                                        if(array.length == 2) {
                                            batch = batch.crop(array[0], array[1]);
                                        } else if(array.length == 4) {
                                            batch = batch.crop(array[0], array[1], array[2], array[3]);
                                        }
                                    }
                                    break;
                                default:
                                    sharedInstance.L.warn(TAG, `unsupported action ${key}.`);
                            }
                        } catch (e) {
                            /*! After a error is caught, reject with error and do whatever to recover
                             *  transform.js (line 31-32)
                             */

                            reject(e);
                            return;
                        }

                    }

                    batch.writeFile(filename, function (err) {
                        resolve(filename);
                    });
                } else {resolve(filename);}

            });
        }

    });
}

export default transform;