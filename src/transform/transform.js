/**
 * Created by r1cebank on 8/23/15.
 */

import AppSingleton         from '../util/appsingleton';
import Fs                   from 'fs';
import Path                 from 'path';

function transform (res, type, req, file, version) {

    let TAG = 'transform';

    let start = new Date();
    var end   = new Date();

    var sharedInstance = AppSingleton.getInstance();

    //  Ger new filename with extensions

    let transformFile = Path.join(__dirname, type.split('/')[0], type.split('/')[1], `transform.js`);

    //  Do all the processing, and return the transformed file
    if(Fs.existsSync(transformFile)) {

        //  Call the transformation file and get the final processed file.
        require(transformFile)(req, file, version).then((file) => {
            res.sendFile(file);
            end = new Date();
            sharedInstance.L.info(TAG, `Processing time ${end-start}ms`);
        }).catch((e) => {
            //  If error is caught, send the original file
            res.sendFile(file);
            sharedInstance.L.error(TAG, e.toString());
        }).done();
    } else {
        //  File don't support transform
        res.sendFile(file);
        end = new Date();
        sharedInstance.L.info(TAG, `Processing time ${end-start}ms`);
    }
}

export default {transform};