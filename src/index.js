/**
 * Yaas main file, yaas is meant to be imported, it also can be a stand alone executable
 * Yaas (Yet another asset server)
 */
const expressListRoutes = require('express-list-routes');

class YaasServer {
    constructor(options = {}) {
        this.urlPrefix = options.urlPrefix || '/api/v1/yaas';
    }
    bindDefault(app, router) {
        app.use(this.urlPrefix, router);
        router.get('/status', require('./routes/status'));

        expressListRoutes({ prefix: this.urlPrefix }, 'API:', router);
    }
}

module.exports = YaasServer;
