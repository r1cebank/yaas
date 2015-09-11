/**
 * version.list
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

/*!
 *  This is the worker for listing all version in a file
 */

import Routes        from '../../routes/routes';

function worker (job, done) {

    //  Call generator and send the data back


    //  job.data.params is param passed from express
    Routes.listversion(job.data.request).then(function (data) {
        done(null, data);
    }).catch(function (e) {done(e);}).done();
}

export default worker;