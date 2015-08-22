/**
 * Created by r1cebank on 8/21/15.
 */

import AppSingleton     from '../util/appsingleton';
import Promise          from 'bluebird';
import Shortid          from 'shortid';
import NeDB             from 'nedb';
import Path             from 'path';
import UrlJoin          from 'url-join';
import _                from 'lodash';

function getfile (req, res) {

    //  Log tag
    let TAG = "route:upload";

    //  Get shared instance from singleton
    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve) => {
        // Get this bucket
        sharedInstance.findBucket({name: req.params.bucket}).then((docs, err) => {
            if(docs.length < 1) res.status(400).send({error: `bucket ${req.body.name} not found`});
            else {
                var bucket = new NeDB({filename: Path.join(sharedInstance.config.server.buckets,
                    req.params.bucket), autoload: true});
                bucket.find({originalname: req.params.filename}, function (err, docs) {
                    if(docs.length < 1) {
                        res.status(400).send({error: `file ${req.file.originalname} not found.`});
                    }
                    else {
                        res.type(docs[0].mimetype);
                        res.sendFile(Path.join(process.cwd(), docs[0].path));
                    }
                });
                resolve({ });
            }
        });
    });

}

export default getfile