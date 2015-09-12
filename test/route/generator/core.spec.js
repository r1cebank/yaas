/**
 * core.spec.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

var Sinon           = require('sinon');
var Chai            = require('chai');
var Path            = require('path');
var xml             = require("node-xml-lite");

Chai.use(require('sinon-chai'));
Chai.use(require('chai-as-promised'));
Chai.should();

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var Config         = require('../../../src/config/config');
var Lorem          = require('../../../src/routes/generator/lorem.js');
var JsonData       = require('../../../src/routes/generator/jsondata.js');
var XMLData        = require('../../../src/routes/generator/xmldata.js');

var req = {
    count: 2
};

var req2 = {
    cookie: 12,
    count: 'i want all'
};

var req3 = {
    count: 2,
    schema: 'bad-schema'
};

var req4 = {
    count: 20000000000000
};

describe('generators', function() {
    describe('lorem', function() {
        it('lorem should generate data', function(done) {
            Lorem(req).should.to.be.fulfilled.then(function (result) {
                result.type.should.equal('object');
                result.data.should.be.a('string');
            }).should.notify(done);
        });
        it('random input should resolve', function(done) {
            Lorem(req2).should.to.be.fulfilled.then(function (result) {
                result.type.should.equal('object');
                result.data.should.be.a('string');
            }).should.notify(done);
        });
    });
    describe('json', function() {
        it('json should generate data on valid input', function(done) {
            JsonData(req).should.to.be.fulfilled.then(function (result) {
                result.type.should.equal('object');
                result.data.length.should.equal(req.count);
            }).should.notify(done);
        });
        it('bad schema should fail', function(done) {
            JsonData(req3).should.to.be.rejected.should.notify(done);
        });
        it('json should limit data count', function(done) {
            JsonData(req4).should.to.be.fulfilled.then(function (result) {
                result.type.should.equal('object');
                result.data.length.should.equal(Config.generator.max);
            }).should.notify(done);
        });
    });
    describe('xml', function() {
        it('xml should generate data on valid input', function(done) {
            XMLData(req).should.to.be.fulfilled.then(function (result) {
                result.type.should.equal('object');
                xml.parseString(result.data).childs.length.should.equal(req.count*2+1);   //    This libraru inserts newline as a child
            }).should.notify(done);
        });
        it('bad schema should fail', function(done) {
            XMLData(req3).should.to.be.rejected.should.notify(done);
        });
        it('xml should limit data count', function(done) {
            XMLData(req4).should.to.be.fulfilled.then(function (result) {
                result.type.should.equal('object');
                xml.parseString(result.data).childs.length.should.equal(Config.generator.max*2+1);
            }).should.notify(done);
        });
    });
});