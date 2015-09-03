/**
 * Created by r1cebank on 8/20/15.
 */

/*!
 *  I am not sure this is required, but it made source code looks much nicer
 */

import upload       from    './upload';
import getfile      from    './getfile';
import listfile     from    './listfile';
import listbucket   from    './listbucket';
import listversion  from    './listversion';

/*!
 *  Export all the routes
 */

export default {
    upload,
    getfile,
    listfile,
    listbucket,
    listversion
};