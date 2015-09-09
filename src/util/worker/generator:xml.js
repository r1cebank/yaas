/**
 * generator:xml
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

/*!
 *  This is the json generator worker, it generates the random json data in the background and convert them to XML
 */

import Generators        from '../../routes/generator/routes';

function worker (job, done) {

    //  Call generator and send the data back

    //  job.data.params is param passed from express
    Generators.xmldata(job.data.request).then(function (data) {
        done(null, data);
    }).catch().done();
}

export default worker;