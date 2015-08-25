/**
 * Created by r1cebank on 8/24/15.
 */

/*!
 *  None will not care about roles, everyhting is permitted
 */

function checkrole (user, role) {

    /*  Any role will be permitted, but will check user to see if the user is coming from the none checkauth
     *  If user doesn't equal no auth, we will fail.
     */

    if(user.user == 'noauth') {
        return true;
    } else {
        return false;
    }
}