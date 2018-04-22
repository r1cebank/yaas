const path = require('path');
const fs = require('fs-extra');
const Singleton = require('../../singleton');

const sharedInstance = Singleton.getInstance();

async function createAlias(req, res) {
    if (!req.body.url) {
        return res.status(400).send({
            error: 'Please provide the url you want to set alias to.'
        });
    }
    if (!req.body.method) {
        return res.status(400).send({
            error: 'Please provide the methohd for the request.'
        });
    }
    if (!req.body.name) {
        return res.status(400).send({
            error: 'Please provide the name for the alias.'
        });
    }
    const aliasPath = path.join(sharedInstance.yaasServer.dataDir, 'alias', req.body.name);
    const aliasExists = await fs.pathExists(aliasPath);
    if (aliasExists) {
        return res.send({
            error: `The alias ${req.body.name} exists.`
        });
    }
    await fs.writeJson(aliasPath, {
        url: req.body.url,
        method: req.body.method,
        payload: req.body.payload
    });
    return res.send({
        success: true
    });
}

module.exports = createAlias;
