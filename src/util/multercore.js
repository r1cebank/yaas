/**
 * Created by r1cebank on 9/5/15.
 */

import Config           from '../config/config.js';
import Shortid          from 'shortid';
import Path             from 'path';
import Mkdir            from 'mkdirp';

/**
 * multer destination folder middleware
 *
 * @method destination
 * @param {Object} req express request
 * @param {Object} file the uploaded file
 * @param {Function} cb callback passed by multer
 * @return {Undefined} Returns nothing
 */
function destination (req, file, cb) {
    //  Get bucket from request
    var bucket = req.path.split('/')[1];
    //  Create this path if not exists
    Mkdir(Path.join(Config.server.storage.dest, bucket));
    cb(null, Path.join(Config.server.storage.dest, bucket));
}

/**
 * multer destination filename middleware
 *
 * @method filename
 * @param {Object} req express request
 * @param {Object} file the uploaded file
 * @param {Function} cb callback passed by multer
 * @return {Undefined} Returns nothing
 */
function filename (req, file, cb) {
    //  If custom file type, modify the mimetype to yaas/<type>
    if(file.originalname.split('.').pop() === 'ysql') {
        file.mimetype = 'yaas/sql';
    }
    cb(null, Shortid.generate() + `.${file.originalname.split('.').pop()}`);
}

export default {destination, filename};