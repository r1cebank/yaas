/**
 * Created by r1cebank on 9/5/15.
 */

import Config           from '../config/config.js';
import Shortid          from 'shortid';
import Path             from 'path';
import Mkdir            from 'mkdirp';

function destination (req, file, cb) {
    //  Get bucket from request
    var bucket = req.path.split('/')[1];
    //  Create this path if not exists
    Mkdir(Path.join(Config.server.storage.dest, bucket));
    cb(null, Path.join(Config.server.storage.dest, bucket));
}

function filename (req, file, cb) {
    //  If custom file type, modify the mimetype to yaas/<type>
    if(file.originalname.split('.').pop() === 'ysql') {
        file.mimetype = 'yaas/sql';
    }
    cb(null, Shortid.generate() + `.${file.originalname.split('.').pop()}`);
}

export default {destination, filename};