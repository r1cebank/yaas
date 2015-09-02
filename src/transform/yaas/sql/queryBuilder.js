/**
 * Created by r1cebank on 9/1/15.
 */

/*!
 *  This file provides the needed function to create query from user input,
 *  replacing the placeholders with real values and make sure input are escaped
 */

import AppSingleton             from '../../../util/appsingleton';

function buildQuery(query, input, req, connection) {

    //  Log Tag
    let TAG = "transform:yaas:sql:build";

    //  Shared instance
    var sharedInstance = AppSingleton.getInstance();

    //  Regex
    let nameRegex = /<%([0-9]+)>/;
    let valueRegex = /<\$([0-9]+)>/;

    //  Never declare variable in a loop
    var match = "",
        match0 = "",
        key = "";

    // replace query params
    while(nameRegex.test(query)) {
        // Loop until regex no longer match item
        match = nameRegex.exec(query)[1];       //  Get the param number
        match0 = nameRegex.exec(query)[0];      //  Get the actual match
        key = input[match];                               //  Get the key name
        query = query.replace(match0, key);                     //  Replace the key with actual value name
    }

    //  replace the values in a loop
    while(valueRegex.test(query)) {
        // Loop until regex no longer match item
        match = valueRegex.exec(query)[1];
        match0 = valueRegex.exec(query)[0];
        key = connection.escape(req[input[match]]);
        query = query.replace(match0, key);
    }

    sharedInstance.L.info(TAG, `query built: ${query}`);

    return query;
}

export default {buildQuery};