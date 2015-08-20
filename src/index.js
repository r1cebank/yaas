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

//  Log TAG
var TAG = "index";

//  Grab the port number or get from deploy environment
let PORT = process.env.PORT || 3939;

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

/*!
 *  Pass the express app instance to appsingleton
 */
sharedInstance.app = app;

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