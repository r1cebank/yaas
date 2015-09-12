/**
 * test/index.spec.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

var Chai           = require('chai');
Chai.use(require('sinon-chai'));
Chai.use(require('chai-as-promised'));
Chai.should();

var sourcemap = require.resolve('source-map-support');
if (sourcemap) { require(sourcemap).install(); }

var Bootstrap = require('../src/util/bootstrap');

Bootstrap();

describe('Core Functions', function () {
    require('./util/core.spec.js');
});

describe('Routes', function() {

});

describe('Workers', function() {
    require('./worker/worker-core.spec.js');
});

describe('Authority', function() {
    require('./auth/auth-core.spec.js');
});

describe('Transforms', function() {
    require('./transform/transform.spec.js');
});