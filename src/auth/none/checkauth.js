/**
 * Created by r1cebank on 8/24/15.
 */

/*!
 *  None will let everyone get in the system, anything is possible
 */

function checkauth (auth) {
    return {user: 'noauth'};
}

export default {checkauth};