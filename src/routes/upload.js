/**
 * Created by r1cebank on 8/20/15.
 */


import AppSingleton     from '../util/appsingleton';
import Promise          from 'bluebird';
import Shortid          from 'shortid';
import Path             from 'path';
import UrlJoin          from 'url-join';
import _                from 'lodash';
import Fs               from 'fs';

function upload (request) {

    //  Log tag
    let TAG = "route:upload";

    //  Get shared instance from singleton
    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve) => {

        //  If no file supplied, error back
        if(!request.file) {
            res.status(404).send({error: "file not supplied"});
            resolve({ });
        } else {
            var bucket = sharedInstance.buckets.collection(request.request.bucket);
            bucket.findOne({originalname: request.file.originalname}, function (err, doc) {
                //  File exists, uploading a new version.

                //  We have a new file, generate a new version code
                var version = Shortid.generate();

                var file = { };
                if (doc) {
                    file = _.clone(doc);
                    file.versions = _.clone(doc.versions);
                    file.versions[version] = {path: request.file.path, timestamp: new Date()};
                    file.latestversion = version;
                    bucket.update({originalname: request.file.originalname}, {
                            $set: {
                                versions: file.versions,
                                latestversion: version
                            }
                        },
                        function (error, doc) {
                            resolve({
                                type: 'object',
                                data: file
                            });
                            sharedInstance.L.info(TAG, `file ${file.originalname} updated, version ${file.latestversion}`);
                        });
                }
                else {
                    //  We have a new file, generate a new version code
                    var versions = {};
                    versions[version] = {path: request.file.path, timestamp: new Date()};

                    //  Clone the file object
                    file = _.clone(request.file);
                    file.versions = versions;
                    file.latestversion = version;
                    file.uploadtime = new Date();
                    file.url = file.url = UrlJoin(sharedInstance.config.server.host, 'buckets',
                        request.request.bucket, request.file.originalname);

                    //  Insert the record into bucket
                    bucket.insert(file, function (err, doc) {
                        sharedInstance.L.info(TAG, "file uploaded");
                    });
                    resolve({
                        type: 'object',
                        data: file
                    });
                }
            });
        }
    });

}

export default upload;