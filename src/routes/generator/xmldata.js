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

function xmldata (request) {

    //  Log tag
    let TAG = "route:generator:xmldata";

    //  Get shared instance from singleton
    var sharedInstance = AppSingleton.getInstance();

    //  Default number of objects is 1
    var objectCount = 1;

    //  If over than specified, reset to max
    if(request.count > sharedInstance.config.generator.max) {
        request.count = sharedInstance.config.generator.max;
    }

    //  If the count in request is a number, replace objects
    if(!isNaN(request.count)) { objectCount = request.count; }

    return new Promise((resolve) => {
        var objects = [ ];
        var schema = JSON.parse(request.schema || "{ }"); //  If undefined, setup empty object
        for (var i = 0; i < objectCount; i++) {
            objects.push(Jsf(schema));
        }
        resolve({
            type: 'object',
            data: Js2xmlparser("result", {data: objects})
        });
    });
}

export default xmldata;