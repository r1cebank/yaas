/**
 * checkrole.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

import AppSingleton         from '../../util/appsingleton';

function checkrole (user, role) {

    /*  Any role will be permitted, but will check user to see if the user is coming from the none checkauth
     *  If user doesn't equal no auth, we will fail.
     */

    let TAG = 'auth:reject:checkrole';

    //  None shall pass
    return false;
}

export default {checkrole};