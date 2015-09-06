/**
 * checkauth.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

import AppSingleton         from '../../util/appsingleton';

function checkauth (auth) {

    let TAG = 'auth:reject:checkauth';
    AppSingleton.getInstance().L.verbose(TAG, 'reject is passing rejecting user');
    return {user: 'reject'};
}

export default {checkauth};