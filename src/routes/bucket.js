/**
 * Created by r1cebank on 8/20/15.
 */

/*!
 *  This is the bucket path, which handles all bucket creation process
 *  a bucket is stored as nedb database in the index file specified in config.js
 */
import AppSingleton     from '../util/appsingleton';
import Promise          from 'bluebird';
import UrlJoin          from 'url-join';

function bucket (req, res) {

    //  Log tag
    let TAG = "route:bucket";

    //  Get shared instance from singleton
    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve) => {
        if(!req.body.name) {
            res.status(400).send({error: `name not specified`});
            resolve({ });
            return;
        }
        //  Find to see if bucket exists TODO: No error checking here
        sharedInstance.findBucket({name: req.body.name}).then((docs, err) => {
            if(docs.length > 0) res.status(400).send({error: `bucket ${req.body.name} exists`});
            else {

                //  We need to tell the client we created the bucket, with the url to access the bucket.
                var document = {
                    message:  `bucket ${req.body.name} created`,
                    url: UrlJoin(sharedInstance.config.server.host,
                        req.body.name)
                };
                //  For now, we just need name in the index file
                sharedInstance.insertBucket({name: req.body.name});
                res.send(document);
            }
        });

        resolve({ });

    });

}

export default bucket;