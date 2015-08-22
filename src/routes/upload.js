/**
 * Created by r1cebank on 8/20/15.
 */


import AppSingleton     from '../util/appsingleton';
import Promise          from 'bluebird';
import Shortid          from 'shortid';
import NeDB             from 'nedb';
import Path             from 'path';
import UrlJoin          from 'url-join';
import _                from 'lodash';

function upload (req, res) {

    //  Log tag
    let TAG = "route:upload";

    //  Get shared instance from singleton
    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve) => {

        // Get this bucket
        sharedInstance.findBucket({name: req.params.bucket}).then((docs, err) => {
            if(docs.length < 1) res.status(400).send({error: `bucket ${req.body.name} not found`});
            else {
                if(req.body.key != docs[0].key) {
                    sharedInstance.L.warn(TAG, "bucket key is incorrect");
                    res.status(403).send({error: 'bucket key is incorrect'});
                    resolve({ });
                } else {
                    sharedInstance.L.info(TAG, "bucket key is correct");
                    var bucket = new NeDB({filename: Path.join(sharedInstance.config.server.buckets,
                        req.params.bucket), autoload: true});
                    bucket.find({name: req.file.originalname}, function (err, docs) {
                        if(docs.length > 0) {
                            res.status(400).send({error: `file ${req.file.originalname} exists.`, file: docs[0]});
                        }
                        else {
                            var file = _.clone(req.file);
                            file.url = UrlJoin(sharedInstance.config.server.host,
                                req.params.bucket, req.file.originalname);
                            bucket.insert(file, function (err, doc) {
                                sharedInstance.L.info(TAG, "file uploaded");
                            });
                            res.send(file);
                        }
                    });
                    resolve({ });
                }
            }
        });
    });

}

export default upload;