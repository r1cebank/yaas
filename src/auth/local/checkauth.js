/**
 * Created by r1cebank on 8/24/15.
 */

/*!
 *  This is the method for local authentication, this will grab the information
 *  from config and return the roles(users)
 */

import AppSingleton         from '../../util/appsingleton';

function checkauth (auth) {

    let TAG = 'auth:local:checkauth';

    //  Returns roles for api key
    return this.auth.keys[auth];
}

export default {checkauth};