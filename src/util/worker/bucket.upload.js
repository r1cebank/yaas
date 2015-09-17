/**
 * bucket.upload
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

import Routes        from '../../routes/routes';

/**
 * kue worker method for uploading file to the system
 *
 * @method worker
 * @param {Object} job kue job
 * @param {Function} done the kue done callback
 * @return {object} Returns current singleton instance
 */
function worker (job, done) {

    //  Call generator and send the data back


    //  job.data.params is param passed from express
    Routes.upload(job.data, job.data.header).then(function (data) {  //  Instead of data.request we are using data since we need the file field
        done(null, data);
    }).catch(function (e) {done(e);}).done();
}

export default worker;