/**
 * Yaas main file, yaas is meant to be imported, it also can be a stand alone executable
 * Yaas (Yet another asset server)
 */
const expressListRoutes = require('express-list-routes');
const bodyParser = require('body-parser');
const Singleton = require('./singleton');
const mkdir = require('mkdirp');
const path = require('path');

const sharedInstance = Singleton.getInstance();

class YaasServer {
    constructor(options = {}, logger) {
        this.urlPrefix = options.urlPrefix || '/api/v1/yaas';
        this.dataDir = options.dataDir || 'files';
        // Create data dir
        mkdir(this.dataDir);

        sharedInstance.yaasServer = this;
        sharedInstance.logger = logger;
    }
    bindDefault(app, router) {
        sharedInstance.app = app;
        sharedInstance.router = router;
        // parse application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: false }));

        // parse raw
        app.use(bodyParser.raw());

        // parse text
        app.use(bodyParser.text());

        // parse application/json
        app.use(bodyParser.json());

        app.use(this.urlPrefix, router);
        router.get('/status', require('./routes/status'));

        // Fileless routes
        // Lorem
        router.get('/lorem/words', require('./routes/lorem/words'));
        router.get('/lorem/sentences', require('./routes/lorem/sentences'));
        router.get('/lorem/paragraphs', require('./routes/lorem/paragraphs'));
        // JSON
        router.post('/json/fromRequest', require('./routes/json/fromRequest'));
        // Alias
        // Create data dir
        mkdir(path.join(this.dataDir, 'alias'));
        router.post('/alias/create', require('./routes/alias/create'));
        router.get('/alias/invoke/:alias', require('./routes/alias/invoke'));

        expressListRoutes({ prefix: this.urlPrefix }, 'API:', router);
    }
}

module.exports = YaasServer;
