/**
 * local.spec.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

var Chai           = require('chai');
var Authority      = require('../../../src/auth/authority').default;

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
    type: 'local',
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
    }
};

var auth = new Authority('local', config);

describe('Local', function () {
    it('should support default authority local', function () {
        expect(auth.type).to.equal('local');
    });
    it('should authenticate api user', function () {
        var access = auth.hasRole(req, res, 'file:get');
        expect(access).to.equal(true);
    });
    it('should not authenticate if role is not permitted', function () {
        var access = auth.hasRole(req, res, 'generator:json');
        expect(access).to.equal(false);
    });
    it('should not authenticate if user does not exist', function () {
        var access = auth.hasRole(req2, res, 'file:get');
        expect(access).to.equal(false);
    });
});
