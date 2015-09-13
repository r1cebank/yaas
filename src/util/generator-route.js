/**
 * generator-route
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

import AppSingleton     from './appsingleton';
import Promise          from 'bluebird';
import Generators       from '../routes/generator/routes';
import Wrapper          from './workerwrapper';

/**
 * set generatorroute
 *
 * @method generatorroute
 * @return {Undefined} Returns nothing
 */

function generatorroute() {

    //  Log tag
    var TAG = "bucketroute";

    //  This instance is shared across the entire app life-cycle
    var sharedInstance = AppSingleton.getInstance();
    /*!
     *  Generators, random generated assets
     */
    sharedInstance.app.get('/generator/lorem', function (req, res) {
        if (sharedInstance.authority.hasRole(req, res, 'generator:lorem')) {
            //Generators.lorem(req, res).then().catch().done();
            Wrapper.wrapper('generator:lorem', req, res);
        }
    });
    sharedInstance.app.get('/generator/json', function (req, res) {
        if (sharedInstance.authority.hasRole(req, res, 'generator:json')) {
            Wrapper.wrapper('generator:json', req, res);
        }
    });
    sharedInstance.app.get('/generator/xml', function (req, res) {
        if (sharedInstance.authority.hasRole(req, res, 'generator:xml')) {
            Wrapper.wrapper('generator:xml', req, res);
        }
    });
}

export default generatorroute;