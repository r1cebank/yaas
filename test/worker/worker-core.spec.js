/**
 * worker.spec
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

var Sinon                 = require('sinon');
var Chai                  = require('chai');
var BucketList            = require('../../src/util/worker/bucket.list.js').default;
var BucketUpload          = require('../../src/util/worker/bucket.upload.js').default;
var FileGet               = require('../../src/util/worker/file.get.js').default;
var FileList              = require('../../src/util/worker/file.list.js').default;
var GeneratorJson         = require('../../src/util/worker/generator.json.js').default;
var GeneratorXML          = require('../../src/util/worker/generator.xml.js').default;
var GeneratorLorem        = require('../../src/util/worker/generator.lorem.js').default;
var VersionList           = require('../../src/util/worker/version.list.js').default;

Chai.use(require('sinon-chai'));
Chai.use(require('chai-as-promised'));
Chai.should();
Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var sourcemap      = require.resolve('source-map-support');
if (sourcemap) { require(sourcemap).install(); }

describe('Worker Core', function () {
    it('bucket:list should load', function() {
        var job = {data: {request: {
            //  Nothing is here
        }}};
        var spy = Sinon.spy();
        BucketList(job, spy);
    });
    it('bucket:upload should load', function() {
        var job = {data: {request: {
            //  Nothing is here
        }}};
        var spy = Sinon.spy();
        BucketUpload(job, spy);
    });
    it('file:get should load', function() {
        var job = {data: {request: {
            //  Nothing is here
        }}};
        var spy = Sinon.spy();
        FileGet(job, spy);
    });
    it('file:list should load', function() {
        var job = {data: {request: {
            //  Nothing is here
        }}};
        var spy = Sinon.spy();
        FileList(job, spy);
    });
    it('generator:json should load', function() {
        var job = {data: {request: {
            //  Nothing is here
        }}};
        var spy = Sinon.spy();
        GeneratorJson(job, spy);
    });
    it('generator:xml should load', function() {
        var job = {data: {request: {
            //  Nothing is here
        }}};
        var spy = Sinon.spy();
        GeneratorXML(job, spy);
    });
    it('generator:lorem should load', function() {
        var job = {data: {request: {
            //  Nothing is here
        }}};
        var spy = Sinon.spy();
        GeneratorLorem(job, spy);
    });
    it('version:list should load', function() {
        var job = {data: {request: {
            //  Nothing is here
        }}};
        var spy = Sinon.spy();
        VersionList(job, spy);
    });
});
