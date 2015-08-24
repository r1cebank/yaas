/**
 * Rai.js entry file.
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

require("babel/polyfill"); //   Needed for some babel functions, remove after ES6

import Multer           from 'multer';
import Express          from 'express';
import BodyParser       from 'body-parser';
import AppSingleton     from './util/appsingleton';
import Bootstrap        from './util/bootstrap';
import Startup          from './util/startup';
import NodeInfo         from 'node-info';
import Config           from './config/config';
import Shortid          from 'shortid';

//  Log TAG
var TAG = "index";

//  Grab the port number or get from deploy environment
let PORT = process.env.PORT || Config.server.port;

//  AppSingleton Instance
var sharedInstance = AppSingleton.getInstance();

/*!
 *  Enable sourcemap support (if present)
 */
let sourcemaps = require.resolve('source-map-support');
if (sourcemaps) { require(sourcemaps).install(); }

/*!
 *  Root express application.
 */
let app = Express();

//  Upload instance
var storage = Multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, Config.server.storage.dest);
    },
    filename: function (req, file, cb) {
        cb(null, Shortid.generate() + `.${file.mimetype.split('/')[1]}`);
    }
});
let upload = Multer({storage});

/*!
 *  Pass the express app + multer + config instance to appsingleton
 */
sharedInstance.app = app;
sharedInstance.upload = upload;
sharedInstance.config = Config;


/*!
 *  Use global express middleware here.
 */
app.use(BodyParser.json()); //  Using bodyparser for POST requests
app.use(BodyParser.urlencoded({ extended: false }));
app.use(NodeInfo()); // Using NodeInfo to display server information

/*!
 *  Bootstrap the application, setting the proper shared variables in AppSingleton
 */
Bootstrap();

/*!
 *  Startup the app, setting the appropriate routes and settings.
 */

Startup().then(function () {
    var server = app.listen(PORT, function () {
        var host = server.address().address;
        var port = server.address().port;
        sharedInstance.L.info(TAG, `Server running at: ${host}:${port}`);
    });
});