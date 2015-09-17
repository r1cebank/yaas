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

function listversion (request, header) {

    //  Log tag
    let TAG = "route:listversion";

    //  Get shared instance from singleton
    var sharedInstance = AppSingleton.getInstance();

    return new Promise((resolve) => {

        //  Open the bucket file to query later
        var bucket = sharedInstance.buckets.collection(request.bucket);

        //  Query the file
        bucket.findOne({originalname: request.filename}, function (err, doc) {
            if(!doc) {
                //  If file is not found, send 404 and a error
                resolve({error: 'file not found'});
            }
            else {
                var urls = [ ];
                //  List all versions
                for(var key of Object.keys(doc.versions)) {
                    urls.push(UrlJoin(header.host, 'buckets',
                        request.bucket, request.filename, `?v=${key}`));
                }
                resolve({
                    type: 'object',
                    data: urls
                });
            }
        });
    });

}

export default listversion;
