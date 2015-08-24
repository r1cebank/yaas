/**
 * Created by r1cebank on 8/22/15.
 */

import AppSingleton     from '../util/appsingleton';
import Promise          from 'bluebird';
import Shortid          from 'shortid';
import NeDB             from 'nedb';
import Path             from 'path';
import UrlJoin          from 'url-join';
import _                from 'lodash';

function listfile (req, res) {

    //  Log tag
    let TAG = "route:upload";

    //  Get shared instance from singleton
    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve) => {
        // Get this bucket
        sharedInstance.findBucket({name: req.params.bucket}).then((docs, err) => {
            if (docs.length < 1) res.status(404).send({error: `bucket ${req.params.bucket} not found`});
            else {
                var bucket = new NeDB({filename: Path.join(sharedInstance.config.server.buckets,
                    req.params.bucket), autoload: true});
                bucket.find({}, function (err, docs) {
                    var urls = [];
                    for(let doc of docs) {
                        urls.push(UrlJoin(sharedInstance.config.server.host,
                            req.params.bucket, doc.originalname));
                    }
                    res.send(urls);
                });
            }
        });
    });
}

export default listfile;