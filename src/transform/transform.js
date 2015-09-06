/**
 * Created by r1cebank on 8/23/15.
 */

/*!
 *  This is the transform function, it takes the file type and determines if the transform file exists
 *  If file exist, process and send the processed file
 */
import AppSingleton         from '../util/appsingleton';
import Fs                   from 'fs';
import Promise              from 'bluebird';
import Path                 from 'path';

function transform (type, req, file, version) {

    let TAG = 'transform';

    let start = new Date();
    var end   = new Date();

    var sharedInstance = AppSingleton.getInstance();

    return new Promise(function (resolve, reject) {
        //  Ger new filename with extensions

        //  for image/jpeg type, the transform file will be stored in /image/jpeg/transform.js
        let transformFile = Path.join(__dirname, type.split('/')[0], type.split('/')[1], `transform.js`);

        //  Do all the processing, and return the transformed file
        Fs.stat(transformFile, (err, stat) => {
            //  If exists in the system, dont bother processing it
            if(!err) {

                //  Call the transformation file and get the final processed file.
                require(transformFile)(req, file, version).then((file) => {
                    //  After processing, the output can be two types, JSON or filepath
                    resolve(file);
                    end = new Date();
                    sharedInstance.L.info(TAG, `Processing time ${end-start}ms`);
                }).catch((e) => {
                    //  If error is caught, send the original file
                    resolve(file);
                    sharedInstance.L.error(TAG, e.toString());
                }).done();
            } else {
                //  File don't support transform
                resolve(file);
            }
        });
    });
}

export default {transform};