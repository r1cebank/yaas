/**
 * Created by r1cebank on 8/21/15.
 */

/*!
 *  This is the getfile path, which handles retrieve the file and apply any
 *  transformation required by the client
 */

import AppSingleton     from '../util/appsingleton';
import Promise          from 'bluebird';
import Shortid          from 'shortid';
import NeDB             from 'nedb';
import Path             from 'path';
import UrlJoin          from 'url-join';
import _                from 'lodash';
import Transform        from '../transform/transform';

function getfile (req, res) {

    //  Log tag
    let TAG = "route:upload";

    //  Get shared instance from singleton
    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve) => {

        // Get this bucket
        sharedInstance.findBucket({name: req.params.bucket}).then((docs, err) => {

            //  If bucket is not found, send 404 to client
            if(docs.length < 1) res.status(404).send({error: `bucket ${req.body.name} not found`});
            else {

                //  read the Nedb database stored on disk.
                var bucket = new NeDB({filename: Path.join(sharedInstance.config.server.buckets,
                    req.params.bucket), autoload: true});

                //  First the file needs to exist
                bucket.find({originalname: req.params.filename}, function (err, docs) {
                    if(docs.length < 1) {
                        res.status(404).send({error: `file ${req.params.filename} not found.`});
                    }
                    else {
                        // Try to see if there is a get param for version
                        var version = docs[0].latestversion;
                        if(req.query.v) version = req.query.v;

                        //  Check if version exists
                        if(!docs[0].versions[version])  {
                            res.status(404).send({error: `version ${version} not found`});
                        } else {

                            //  Combining inputs
                            var request = _.extend(req.params || {}, req.query || {}, req.body || {});
                            //  Needs to delete to avoid issues when deciding if processing is needed
                            delete request.v;
                            delete request.auth;
                            delete request.bucket;
                            delete request.filename;
                            // Processing
                            Transform.transform(res, docs[0].mimetype,
                                request, Path.join(process.cwd(),
                                docs[0].versions[version]), version);
                        }
                    }
                });
                resolve({ });
            }
        });
    });

}

export default getfile;