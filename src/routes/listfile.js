/**
 * Created by r1cebank on 8/22/15.
 */

/*!
 *  This is the list file route, which will output all the files in a bucket
 */

import AppSingleton     from '../util/appsingleton';
import Promise          from 'bluebird';
import Shortid          from 'shortid';
import Path             from 'path';
import UrlJoin          from 'url-join';
import _                from 'lodash';

function listfile (req, res) {

    //  Log tag
    let TAG = "route:listfile";

    //  Get shared instance from singleton
    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve) => {

        //  Open this Nedb so a find query can be executed later
        var bucket = sharedInstance.buckets.collection(req.params.bucket);

        //  Using {} will yield us all the records in the bucket
        bucket.find().toArray(function (err, docs) {
            var urls = [];
            for(let doc of docs) {

                //  All we want is a array of urls back to the client
                urls.push(UrlJoin(sharedInstance.config.server.host,
                    req.params.bucket, doc.originalname));
            }
            res.send(urls);
        });
        resolve({ });
    });
}

export default listfile;
