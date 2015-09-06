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

describe('Core Functions', function () {
    require('./util/core.spec.js');
});

describe('Routes', function() {

});

describe('Transforms', function() {
    require('./transform/transform.spec.js');
});