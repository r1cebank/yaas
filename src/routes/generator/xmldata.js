/**
 * xmldata
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

/*!
 *  This is the json data generator, again using a 3rd party library
 */

import AppSingleton     from '../../util/appsingleton';
import Promise          from 'bluebird';
import Shortid          from 'shortid';
import Random           from 'generate-random-data';
import Jsf              from 'json-schema-faker';
import Js2xmlparser     from 'js2xmlparser';
import _                from 'lodash';

function xmldata (req, res) {

    //  Log tag
    let TAG = "route:generator:xmldata";

    //  Get shared instance from singleton
    var sharedInstance = AppSingleton.getInstance();

    //  Combine all request params
    var request = _.clone(req.params);
    //  Default number of objects is 1
    var objectCount = 1;

    //  If the count in request is a number, replace objects
    if(!isNaN(request.count)) { objectCount = request.count; }

    return new Promise((resolve) => {
        try {
            var objects = [ ];
            var schema = JSON.parse(request.schema);
            for (var i = 0; i < objectCount; i++) {
                objects.push(Jsf(schema));
            }
            res.send(Js2xmlparser("result", {data: objects}));
        } catch(e) {
            sharedInstance.L.error(TAG, `error occurred: ${e}`);
            res.status(400).send({error: e.toString()});
        }
        resolve({ });
    });
}

export default xmldata;