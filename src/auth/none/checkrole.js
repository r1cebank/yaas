/**
 * Created by r1cebank on 8/24/15.
 */

/*!
 *  None will not care about roles, everyhting is permitted
 */

import AppSingleton         from '../../util/appsingleton';

function checkrole (user, role) {

    /*  Any role will be permitted, but will check user to see if the user is coming from the none checkauth
     *  If user doesn't equal no auth, we will fail.
     */

    let TAG = 'auth:none:checkrole';

    if(user.user == 'noauth') {
        AppSingleton.getInstance().L.info(TAG, 'checkauth is passing allow');
        return true;
    } else {
        AppSingleton.getInstance().L.error(TAG, 'something is very refuse');
        return false;
    }
}

export default {checkrole};