/**
 * route-core.spec.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */


var Sinon           = require('sinon');
var Chai            = require('chai');
var Path            = require('path');


Chai.use(require('sinon-chai'));
Chai.use(require('chai-as-promised'));
Chai.should();

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var Config         = require('../../src/config/config');


describe('route core', function() {
    require('./generator/core.spec.js');
});