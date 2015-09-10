/**
 * generator:lorem
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

/*!
 *  This is the lorem generator worker, it generates the lorem string/paragraph in the background
 */

import Generators        from '../../routes/generator/routes';

function worker (job, done) {

    //  Call generator and send the data back

    //  job.data.params is param passed from express
    Generators.lorem(job.data.request).then(function (data) {
        done(null, data);
    }).catch(function (e) {done(e);}).done();
}

export default worker;