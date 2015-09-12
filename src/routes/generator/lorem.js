/**
 * lorem
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

/*!
 *  This is the lorem generator, very simple, using a 3rd party library
 */

import AppSingleton     from '../../util/appsingleton';
import Promise          from 'bluebird';
import Lorem            from 'lorem-ipsum';

function lorem (request) {

    //  Log tag
    let TAG = "route:generator:lorem";

    //  Get shared instance from singleton
    var sharedInstance = AppSingleton.getInstance();

    //  If over than specified, reset to max
    if(request.count > sharedInstance.config.generator.max) {
        request.count = sharedInstance.config.generator.max;
    }

    return new Promise((resolve) => {
        var output = Lorem(request);
        resolve({
            type: 'object',
            data: output
        });
    });
}

export default lorem;