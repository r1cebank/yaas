/**
 * yaas.js entry file.
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

//require("babel/polyfill"); //   Needed for some babel functions, remove after ES6

//  NPM packages
import Multer           from 'multer';
import Express          from 'express';
import BodyParser       from 'body-parser';
import NodeInfo         from 'node-info';
import Shortid          from 'shortid';
import Fs               from 'fs';
import HTTP             from 'http';
import HTTPS            from 'https';

//  Custom library
import AppSingleton     from './util/appsingleton';
import Bootstrap        from './util/bootstrap';
import MulterCore       from './util/multercore';
import Startup          from './util/startup';
import Config           from './config/config';

//  Log TAG
var TAG = "index";

//  HTTPS Certificates
//  var key = Fs.readFileSync('./cert/cert_p.p12', 'utf8');
//  var cert = Fs.readFileSync('./cert/cert.cer', 'utf8');
//  var credentials = {key, cert};

//  Grab the port number or get from deploy environment
let PORT = process.env.PORT || Config.server.port;
let PORT_SSL = process.env.PORT_SSL || Config.server.port_ssl;

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
    destination: MulterCore.destination,
    filename: MulterCore.filename
});
let upload = Multer({storage});

/*!
 *  Pass the express app + multer + config instance to appsingleton
 */
sharedInstance.app = app;
sharedInstance.upload = upload;


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
    var server = HTTP.createServer(app).listen(PORT);
    //var server_https = HTTPS.createServer(credentials, app).listen(PORT_SSL);
    var host = server.address().address;
    sharedInstance.L.info(TAG, `HTTP Server running at: ${host}:${PORT}`);
    //sharedInstance.L.info(TAG, `HTTPS Server running at: ${host}:${PORT_SSL}`);
});
