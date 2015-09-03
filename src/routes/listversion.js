/**
 * Created by r1cebank on 8/22/15.
 */

/*!
 *  This is the list version role, we will need this to list all the file versions for a file
 */
import AppSingleton     from '../util/appsingleton';
import Promise          from 'bluebird';
import Shortid          from 'shortid';
import Path             from 'path';
import UrlJoin          from 'url-join';
import _                from 'lodash';

function listversion (req, res) {

    //  Log tag
    let TAG = "route:listversion";

    //  Get shared instance from singleton
    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve) => {

        //  Open the nedb file to query later
        var bucket = sharedInstance.buckets.collection(req.params.bucket);

        //  Query the file
        bucket.findOne({originalname: req.params.filename}, function (err, doc) {
            if(!doc) {
                //  If file is not found, send 404 and a error
                res.status(404).send({error: `file ${req.params.filename} not found.`});
            }
            else {
                //  List all versions
                var urls = [ ];
                for(var key of Object.keys(doc.versions)) {
                    urls.push(UrlJoin(sharedInstance.config.server.host,
                        req.params.bucket, req.params.filename, `?v=${key}`));
                }
                res.send(urls);
            }
        });
        resolve({ });
    });

}

export default listversion;
