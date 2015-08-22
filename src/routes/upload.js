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
import Fs               from 'fs';

function upload (req, res) {

    //  Log tag
    let TAG = "route:upload";

    //  Get shared instance from singleton
    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve) => {

        //  If no file supplied, error back
        if(!req.file) {
            res.status(404).send({error: "File not supplied"});
            resolve({ });
        } else {
            // Get this bucket
            sharedInstance.findBucket({name: req.params.bucket}).then((docs, err) => {
                if(docs.length < 1) {
                    //  Send back a error, delete the file
                    Fs.unlink(req.file.path);
                    res.status(400).send({error: `bucket ${req.params.bucket} not found`});
                }
                else {
                    if(req.body.key != docs[0].key) {
                        //  Send a error, delete the file
                        Fs.unlink(req.file.path);
                        sharedInstance.L.warn(TAG, "bucket key is incorrect");
                        res.status(403).send({error: 'bucket key is incorrect'});
                        resolve({ });
                    } else {
                        sharedInstance.L.info(TAG, "bucket key is correct");
                        var bucket = new NeDB({filename: Path.join(sharedInstance.config.server.buckets,
                            req.params.bucket), autoload: true});
                        bucket.find({originalname: req.file.originalname}, function (err, docs) {
                            if(docs.length > 0) {
                                console.log("File exists.");
                                //  File exists, uploading a new version.

                                //  We have a new file, generate a new version code
                                var version = Shortid.generate();

                                var file = _.clone(docs[0]);
                                file.versions = _.clone(docs[0].versions);
                                file.versions[version] = req.file.path;
                                file.latestversion = version;
                                bucket.update({originalname: req.file.originalname}, { $set: {versions: file.versions,
                                        latestversion: version}},
                                    function (error, doc) {
                                        res.send(file);
                                        sharedInstance.L.info(TAG, `file ${file.originalname} updated, version ${file.latestversion}`);
                                    });
                            }
                            else {

                                var version = Shortid.generate();

                                //  We have a new file, generate a new version code
                                var versions = { };
                                versions[version] = req.file.path;

                                //  Clone the file object
                                var file = _.clone(req.file);
                                file.versions = versions;
                                file.latestversion = version;
                                file.url = file.url = UrlJoin(sharedInstance.config.server.host,
                                    req.params.bucket, req.file.originalname);

                                //  Insert the record into bucket
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
        }

        // Get this bucket
    });

}

export default upload;