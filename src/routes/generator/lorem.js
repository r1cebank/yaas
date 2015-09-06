/**
 * lorem
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

/*!
 *  This is the list bucket route, does only one thing, list all buckets in index file
 */

import AppSingleton     from '../../util/appsingleton';
import Promise          from 'bluebird';
import Shortid          from 'shortid';
import Lorem            from 'lorem-ipsum';
import _                from 'lodash';

function lorem (req, res) {

    //  Log tag
    let TAG = "route:generator:lorem";

    //  Get shared instance from singleton
    var sharedInstance = AppSingleton.getInstance();

    //  Combine all request params
    var request = _.clone(req.params);

    return new Promise((resolve) => {
        var output = Lorem(request);
        res.send(output);
        resolve({ });
    });
}

export default lorem;