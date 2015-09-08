/**
 * Created by r1cebank on 8/24/15.
 */

/*!
 *  This is the checkrole method, input is a list of roles that user is the user with roles
 */

import AppSingleton         from '../../util/appsingleton';
import _                    from 'lodash';

function checkrole (user, role) {

    /*  Any role will be permitted, but will check user to see if the user is coming from the none checkauth
     *  If user doesn't equal no auth, we will fail.
     */

    let TAG = 'auth:local:checkrole';
    if(_.includes(user.roles, role)) {
        AppSingleton.getInstance().L.verbose(TAG, 'local is passing allow');
        return true;
    } else {
        AppSingleton.getInstance().L.verbose(TAG, 'local is passing refuse');
        return false;
    }
}

export default {checkrole};