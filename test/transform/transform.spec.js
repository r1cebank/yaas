/**
 * transform.spec.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

var Sinon           = require('sinon');
var Chai            = require('chai');
var Path            = require('path');


Chai.use(require('chai-spies'));
Chai.use(require('chai-as-promised'));
Chai.should();

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var Transform       = require('../../src/transform/transform');

describe('core transform', function() {
    describe('image', function() {
        it('should transform file if params supplied', function () {
            var doc = {
                mimetype: 'image/jpeg',
                versions: [
                    'test'
                ]
            };
            var version = '0';
            var request = {scale: 0.1};
            expect(Transform.transform(doc.mimetype, request,
                Path.join(process.cwd(), 'test', 'fixture','file.jpeg'), version)).to.eventually.equal('');
        });
        it('should redirect file if no request params', function () {
            var doc = {
                mimetype: 'image/jpeg',
                versions: [
                    'test'
                ]
            };
            var version = '0';
            var request = {};
            expect(Transform.transform(doc.mimetype, request,
                Path.join(process.cwd(), 'test', 'fixture','file.jpeg'), version)).to.eventually.equal(
                Path.join(process.cwd(), 'test', 'fixture','file.jpeg')
            );
        });
        it('should give error if file not found', function () {
            var doc = {
                mimetype: 'image/jpeg',
                versions: [
                    'test'
                ]
            };
            var version = '0';
            var request = {};
            expect(Transform.transform(doc.mimetype, request, 'file2.jpeg', version)).to.eventually.equal('file2.jpeg');
        });
        it('should scale file', function () {
            var doc = {
                mimetype: 'image/jpeg',
                versions: [
                    'test'
                ]
            };
            var version = '0';
            var request = {scale:0.2};
            expect(Transform.transform(doc.mimetype, request,
                Path.join(process.cwd(), 'test', 'fixture','file.jpeg'), version)).to.eventually.equal(
                Path.join(process.cwd(), 'test', 'fixture','file.jpeg')
            );
        });
        //it('should crop file', function () {
        //    var doc = {
        //        mimetype: 'image/jpeg',
        //        versions: [
        //            'test'
        //        ]
        //    };
        //    var version = '0';
        //    var request = {crop:'[0,0]'};
        //    expect(Transform.transform(doc.mimetype, request,
        //        Path.join(process.cwd(), 'test', 'fixture','file.jpeg'), version)).to.eventually.equal(
        //        Path.join(process.cwd(), 'test', 'fixture','file.jpeg')
        //    );
        //});
        //it('should crop file with 4 params', function () {
        //    var doc = {
        //        mimetype: 'image/jpeg',
        //        versions: [
        //            'test'
        //        ]
        //    };
        //    var version = '0';
        //    var request = {crop:'[0,0,1,1]'};
        //    expect(Transform.transform(doc.mimetype, request,
        //        Path.join(process.cwd(), 'test', 'fixture','file.jpeg'), version)).to.eventually.equal(
        //        Path.join(process.cwd(), 'test', 'fixture','file.jpeg')
        //    );
        //});
    });
    describe('json', function() {
        it('should redirect file if no request params', function () {
            var doc = {
                mimetype: 'application/json',
                versions: [
                    'test'
                ]
            };
            var version = '0';
            var request = {};
            expect(Transform.transform(doc.mimetype, request, 'file.json', version)).to.eventually.equal('file.json');
        });
        it('any error should redirect original file', function () {
            var doc = {
                mimetype: 'application/json',
                versions: [
                    'test'
                ]
            };
            var version = '0';
            var request = {
                query: '$[?(@.country=="Japan")]'
            };
            expect(Transform.transform(doc.mimetype, request, 'file.json', version)).to.eventually.equal('file.json');
        });
        it('should transform if there are options', function () {
            var doc = {
                mimetype: 'application/json',
                versions: [
                    'test'
                ]
            };
            var version = '0';
            var request = {
                query: '$[?(@.country=="Japan")]'
            };
            expect(Transform.transform(doc.mimetype, request,
                Path.join(process.cwd(), 'test', 'fixture','data.json'), version)).to.eventually.equal(''
            );
        });
    });
});