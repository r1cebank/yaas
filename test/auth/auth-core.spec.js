/**
 * auth-core.spec.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

var Chai           = require('chai');
var Authority      = require('../../src/auth/authority');

Chai.use(require('sinon-chai'));
Chai.use(require('chai-as-promised'));
Chai.should();
Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var sourcemap      = require.resolve('source-map-support');
if (sourcemap) { require(sourcemap).install(); }

var req = {
};
var res = {
    status: () => {return res;},
    send:   () => {return res;}
};

describe('Authority Core', function () {
    it('should default to reject if auth type does not exist', function () {
        var auth = new Authority('some_random_type', {overwrites:[]});
        expect(auth.type).to.equal('reject');
        var access = auth.hasRole(res, res, 'file:get');
        expect(access).to.equal(false);
    });
    require('./local/local.spec.js');
    require('./none/none.spec.js');
});