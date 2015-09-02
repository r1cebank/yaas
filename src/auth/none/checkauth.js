/**
 * Created by r1cebank on 8/24/15.
 */

/*!
 *  None will let everyone get in the system, anything is possible
 */

import AppSingleton         from '../../util/appsingleton';

function checkauth (auth) {

    let TAG = 'auth:none:checkauth';
    AppSingleton.getInstance().L.verbose(TAG, 'checkauth is passing noauth');
    return {user: 'noauth'};
}

export default {checkauth};