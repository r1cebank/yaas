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
var BootStrap       = require('../../src/util/bootstrap');

describe('core transform', function() {
    beforeEach(function () {
        BootStrap();
    });
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
});