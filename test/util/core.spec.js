/**
 * util/core.spec.js
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


var MulterCore     = require('../../src/util/multercore').default;
var Config         = require('../../src/config/config');


describe('multer core', function() {
    it('should give correct destination', function() {
        //  Setup request
        var req = {path: '/rai/upload'};
        var cb = Sinon.spy();
        MulterCore.destination(req, { }, cb);

        expect(cb).to.have.been.calledWith(null, Path.join(Config.server.storage.dest, 'rai'));
    });
    it('should give different filename', function() {
        var file = {originalname: 'test.png'};
        var cb = Sinon.spy();

        MulterCore.filename({ }, file, cb);

        expect(cb).to.have.been.calledWith(null, Sinon.match(/(\S+).png/));
    });
    it('ysql object needs to retain their extension', function() {
        var file = {originalname: 'test.ysql'};
        var cb = Sinon.spy();

        MulterCore.filename({ }, file, cb);

        expect(cb).to.have.been.calledWith(null, Sinon.match(/(\S+).ysql/));
    });
    it('ysql object needs to nave yaas mimetype', function() {
        var file = {originalname: 'test.ysql'};
        var cb = Sinon.spy();

        MulterCore.filename({ }, file, cb);

        expect(cb).to.have.been.calledWith(null, Sinon.match(/(\S+).ysql/));
        expect(file.mimetype.split('/')[0]).to.equal('yaas');
    });
});
