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

function transform(type, req, file, version) {

    let TAG = 'transform:image:jpeg';

    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve, reject) => {

        // If no param supplied, resolve
        if(_.isEmpty(req)) {
            sharedInstance.L.info(TAG, "no transform options provided.");
            resolve({
                type: 'path',
                mimetype: type,
                path: file
            });
        } else {
            lwip.open(file, function (err, image) {
                if(err) {
                    //  If there is error, return the original file
                    sharedInstance.L.error(TAG, 'file open error');
                    resolve({
                        type: 'path',
                        mimetype: type,
                        path: file
                    });
                }
                sharedInstance.L.verbose(TAG, `file ${file} opened`);
                var batch = image.batch();

                //  Needed the version number to enforce the files don't collide.
                req.v = version;
                var filename = Path.join(sharedInstance.config.server.storage.processed, `${hash.digest(req)}.jpeg`);
                //  Needs to delete v to avoid confusions
                delete req.v;

                Fs.stat(filename, (err, stat) => {
                    //  If exists in the system, dont bother processing it
                    if(err) {
                        //  All processing goes here.
                        for(var key of Object.keys(req)) {
                            try {

                                /*!
                                 *  I am aware that having a big switch statement is not ideal,
                                 *  but thinking about having a chainable pipe with promises is just too
                                 *  much code.
                                 *  If we decides that chainable transform is needed, i am happy to implement
                                 */
                                switch(key) {
                                    case "scale":
                                        //  Scale the image
                                        if(!isNaN(req[key])) {
                                            batch = batch.scale(Number(req[key]));
                                        }
                                        break;
                                    case "crop":
                                        //  Crop the image
                                        if(JSON.parse(req[key]) instanceof Array) {
                                            let array = JSON.parse(req[key]);
                                            if(array.length === 2) {
                                                batch = batch.crop(array[0], array[1]);
                                            } else if(array.length === 4) {
                                                batch = batch.crop(array[0], array[1], array[2], array[3]);
                                            }
                                        }
                                        break;
                                    case "rotate":
                                        if(!isNaN(req[key])) {
                                            batch = batch.rotate(Number(req[key]), 'white');
                                        }
                                        break;
                                    case "blur":
                                        if(!isNaN(req[key])) {
                                            batch = batch.blur(Number(req[key]));
                                        }
                                        break;
                                    case "sharpen":
                                        if(!isNaN(req[key])) {
                                            batch = batch.sharpen(Number(req[key]));
                                        }
                                        break;
                                    case "mirror":
                                        let actions = ['x', 'y', 'xy'];
                                        if(_.includes(actions, req[key])) {
                                            batch = batch.mirror(req[key]);
                                        }
                                        break;
                                    case "saturate":
                                        if(!isNaN(req[key])) {
                                            batch = batch.saturate(Number(req[key]));
                                        }
                                        break;
                                    case "lighten":
                                        if(!isNaN(req[key])) {
                                            batch = batch.lighten(Number(req[key]));
                                        }
                                        break;
                                    case "darken":
                                        if(!isNaN(req[key])) {
                                            batch = batch.darken(Number(req[key]));
                                        }
                                        break;
                                    case "hue":
                                        if(!isNaN(req[key])) {
                                            batch = batch.hue(Number(req[key]));
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
                            if(err) {
                                sharedInstance.L.error(TAG, `error occured: ${err.toString()}`);
                                resolve({
                                    type: 'path',
                                    mimetype: type,
                                    path: file
                                });
                            }
                            else {
                                resolve({
                                    type: 'path',
                                    mimetype: type,
                                    path: filename
                                });
                            }
                        });
                    } else {
                        sharedInstance.L.info(TAG, 'skip processing since file exists');
                        resolve({
                            type: 'path',
                            mimetype: type,
                            path: filename
                        });
                    }
                });

            });
        }

    });
}

export default transform;
