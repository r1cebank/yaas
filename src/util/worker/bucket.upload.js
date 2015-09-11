/**
 * bucket.upload
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

/*!
 *  This is the worker for uploading file to the system
 */

import Routes        from '../../routes/routes';

function worker (job, done) {

    //  Call generator and send the data back


    //  job.data.params is param passed from express
    Routes.upload(job.data).then(function (data) {  //  Instead of data.request we are using data since we need the file field
        done(null, data);
    }).catch(function (e) {done(e);}).done();
}

export default worker;