/**
 * local.spec.js
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
        'file:get': 'none',
            'version:list': 'none',
            'bucket:list': 'none',
            'yaas:list': 'none',
            'generator:lorem': 'none',
            'generator:json': 'none',
            'generator:xml': 'none'
    }
};

var auth = new Authority('local', config);

describe('Local', function () {
    it('should support default authority local', function () {
        expect(auth.type).to.equal('local');
    });
    it('should authenticate api user', function () {
    });
});