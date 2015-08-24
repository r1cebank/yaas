/**
 * Created by r1cebank on 8/22/15.
 */

import AppSingleton     from '../util/appsingleton';
import Promise          from 'bluebird';
import Shortid          from 'shortid';
import NeDB             from 'nedb';
import Path             from 'path';
import UrlJoin          from 'url-join';
import _                from 'lodash';

function listbucket (req, res) {

    //  Log tag
    let TAG = "route:upload";

    //  Get shared instance from singleton
    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve) => {
        // Get this bucket
        sharedInstance.findBucket({ }).then((docs, err) => {

            //  List all the buckets
            var buckets = [ ];
            for(let doc of docs) {
                buckets.push(doc.name);
            }
            res.send(buckets);
        });
    });
}

export default listbucket;