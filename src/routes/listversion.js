/**
 * Created by r1cebank on 8/22/15.
 */

/*!
 *  This is the list version role, we will need this to list all the file versions for a file
 */
import AppSingleton     from '../util/appsingleton';
import Promise          from 'bluebird';
import Shortid          from 'shortid';
import NeDB             from 'nedb';
import Path             from 'path';
import UrlJoin          from 'url-join';
import _                from 'lodash';

function listversion (req, res) {

    //  Log tag
    let TAG = "route:upload";

    //  Get shared instance from singleton
    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve) => {
        // Get this bucket
        sharedInstance.findBucket({name: req.params.bucket}).then((docs, err) => {

            //  If no bucket found, sends back error
            if(docs.length < 1) res.status(404).send({error: `bucket ${req.params.bucket} not found`});
            else {

                //  Open the nedb file to query later
                var bucket = new NeDB({filename: Path.join(sharedInstance.config.server.buckets,
                    req.params.bucket), autoload: true});

                //  Query the file
                bucket.find({originalname: req.params.filename}, function (err, docs) {
                    if(docs.length < 1) {
                        //  If file is not found, send 404 and a error
                        res.status(404).send({error: `file ${req.params.filename} not found.`});
                    }
                    else {
                        //  List all versions
                        var urls = [ ];
                        for(var key of Object.keys(docs[0].versions)) {
                            urls.push(UrlJoin(sharedInstance.config.server.host,
                                req.params.bucket, req.params.filename, `?v=${key}`));
                        }
                        res.send(urls);
                    }
                });
                resolve({ });
            }
        });
    });

}

export default listversion;