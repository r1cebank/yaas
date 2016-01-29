/**
 * auth-core.spec.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

var Chai           = require('chai');
var Authority      = require('../../src/auth/authority').default;

Chai.use(require('sinon-chai'));
Chai.use(require('chai-as-promised'));
Chai.should();
Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var sourcemap      = require.resolve('source-map-support');
if (sourcemap) { require(sourcemap).install(); }

var req = {
    body: {
        auth: "c9cba3d805ff526866d27b5504005766"
    }
};

var req2 = {
    body: {
        auth: "c9cba32805ff526866d27b5504005766"
    }
};

var res = {
    status: () => {return res;},
    send:   () => {return res;}
};

var config = {
    type: 'none',
    keys: {
        c9cba3d805ff526866d27b5504005766: {
            roles: [
                'yaas:list',
                'bucket:upload',
                'bucket:list',
                'file:get',
                'version:list'
            ]
        }
    },
    overwrites: {
        'file:get': 'local',
        'generator:json': 'local'
    }
};

var auth2 = new Authority('none', config);

describe('Authority Core', function () {
    it('should default to reject if auth type does not exist', function () {
        var auth = new Authority('some_random_type', {overwrites:[]});
        expect(auth.type).to.equal('reject');
        var access = auth.hasRole(res, res, 'file:get');
        expect(access).to.equal(false);
    });
    it('cannot call authority', function () {
        expect(Authority).to.throw(TypeError);
    });
    it('overwrite should work', function () {
        var access = auth2.hasRole(req, res, 'file:get');
        expect(access).to.equal(true);
    });
    it('overwrite should fail if role not found', function () {
        var access = auth2.hasRole(req, res, 'generator:json');
        expect(access).to.equal(false);
    });
    it('overwrite should fail if user not found', function () {
        var access = auth2.hasRole(req2, res, 'generator:json');
        expect(access).to.equal(false);
    });
    it('overwrite should reset', function () {
        var access = auth2.hasRole(req, res, 'file:get');
        expect(access).to.equal(true);
        var access2 = auth2.hasRole(req, res, 'bucket:list');
        expect(access2).to.equal(true);
    });
    require('./local/local.spec.js');
    require('./none/none.spec.js');
});
