/**
 * Created by r1cebank on 8/24/15.
 */

/*!
 *  None will not care about roles, everything is permitted
 */

import AppSingleton         from '../../util/appsingleton';

function checkrole (user, role) {

    /*  Any role will be permitted, but will check user to see if the user is coming from the none checkauth
     *  If user doesn't equal no auth, we will fail.
     */

    let TAG = 'auth:none:checkrole';

    AppSingleton.getInstance().L.verbose(TAG, 'checkauth is passing allow');
    return true;
}

export default {checkrole};