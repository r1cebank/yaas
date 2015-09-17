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
import Path             from 'path';
import UrlJoin          from 'url-join';
import _                from 'lodash';
import Transform        from '../transform/transform';
//  Old require still using require
var hash = require('json-hash');

function getfile (request, header) {

    //  Log tag
    let TAG = "route:getfile";

    //  Get shared instance from singleton
    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve) => {

        //  read the Nedb database stored on disk.
        var bucket = sharedInstance.buckets.collection(request.bucket);

        //  First the file needs to exist
        bucket.findOne({originalname: request.filename}, function (err, doc) {
            if(!doc) {
                res.status(404).send({error: `file ${request.filename} not found.`});
            }
            else {
                // Try to see if there is a get param for version
                var version = doc.latestversion;
                if(request.v) {
                    version = request.v;
                }

                //  Check if version exists
                if(!doc.versions[version])  {
                    res.status(404).send({error: `version ${version} not found`});
                } else {

                    //  This is used only for caching.
                    var requestForHashing = _.clone(request);

                    //  Again, delete the auth which is going to cause unexpected issue in hashing.
                    requestForHashing.v = version;
                    delete requestForHashing.auth;

                    //  Needs to delete to avoid issues when deciding if processing is needed
                    delete request.v;
                    delete request.auth;
                    delete request.bucket;
                    delete request.filename;
                    sharedInstance.L.verbose(TAG, `request for hashing: ${JSON.stringify(requestForHashing)}`);

                    /*! Used for caching, since we need unique hash for each request and make sure the
                     *  same request yields the same hash so we are ensure that our cache is always valid
                     *  for a particular request. But! need a better caching system so that we won't use up
                     *  memory/old cache is purged once TTL passed.
                     */
                    var requestHash = hash.digest(requestForHashing);
                    sharedInstance.L.verbose(TAG, `request hash: ${requestHash}`);
                    // Processing
                    Transform.transform(doc.mimetype,
                        request, Path.join(doc.versions[version].path), version).then(function (result) {
                            resolve(result);
                        });
                }
            }
        });
    });

}

export default getfile;
