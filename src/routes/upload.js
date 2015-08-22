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
        if(!req.file) res.status(404).send({error: "File not supplied"});

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
                    bucket.find({name: req.file.originalname}, function (err, docs) {
                        if(docs.length > 0) {
                            console.log("File exists.");
                            //  File exists, uploading a new version.

                            var versions = {
                                file:       _.clone(req.file),
                                version:    Shortid.generate(),
                                path:       req.file.path
                            };
                            var file = _.clone(docs[0]);
                            console.log(file);
                            file.versions.push(versions);
                            file.latestVersion = versions.version;
                            bucket.update({name: req.file.originalname}, { $set: {versions: file.versions}},
                                function (err, doc) {
                                    sharedInstance.L.info(TAG, `file ${file.originalname} updated, version ${versions.version}`);
                            });
                            res.send(file);
                        }
                        else {

                            //  We have a new file, generate a new version code
                            var versions = {
                                file:       _.clone(req.file),
                                version:    Shortid.generate(),
                                path:       req.file.path
                            };
                            var file = { };
                            file.name = req.file.originalname;
                            file.versions = [ ];
                            file.versions.push(versions);
                            file.latestVersion = versions.version;
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
    });

}

export default upload;