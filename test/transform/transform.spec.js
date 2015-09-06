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
    it('should redirect file if no request params', function () {
        var res = {
            send: function (data) {
            },
            type: function (type) {
            },
            sendFile: function (file) {
            }
        };
        var sendFileSpy = Chai.spy.on(res, 'sendFile');
        var doc = {
            mimetype: 'application/json',
            versions: [
                'test'
            ]
        };
        var version = '0';
        var request = {};
        Transform.transform(doc.mimetype, request, 'file.json', version).then(function (file) {
            expect(file).to.equal('file.json');
        });
    });
});