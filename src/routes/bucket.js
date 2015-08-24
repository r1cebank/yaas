/**
 * Created by r1cebank on 8/20/15.
 */

import AppSingleton     from '../util/appsingleton';
import Promise          from 'bluebird';
import Shortid          from 'shortid';

function bucket (req, res) {

    //  Log tag
    let TAG = "route:bucket";

    //  Get shared instance from singleton
    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve) => {
        if(req.body.secret != sharedInstance.config.secret) {
            sharedInstance.L.warn(TAG, "secret is incorrect");
            res.status(403).send({error: 'secret is incorrect'});
            resolve({ });
        } else {
            sharedInstance.L.info(TAG, "api key is correct");

            //  Find to see if bucket exists TODO: No error checking here
            sharedInstance.findBucket({name: req.body.name}).then((docs, err) => {
                if(docs.length > 0) res.status(400).send({error: `bucket ${req.body.name} exists`});
                else {
                    var document = {
                        name: req.body.name,
                        key: Shortid.generate()
                    };
                    sharedInstance.insertBucket(document);
                    res.send(document);
                }
            });

            resolve({ });
        }

    });

}

export default bucket;