/**
 * none.spec.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

var Chai           = require('chai');
var Authority      = require('../../../src/auth/authority');

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
        'file:get': 'local'
    }
};

var auth = new Authority('none', config);

describe('None', function () {
    it('should support default authority none', function () {
        expect(auth.type).to.equal('none');
    });
    it('it should pass all role', function () {
        var access = auth.hasRole(req, res, 'bucket:list');
        expect(access).to.equal(true);
    });
});