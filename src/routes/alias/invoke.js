const path = require('path');
const fs = require('fs-extra');
const rp = require('request-promise');
const Singleton = require('../../singleton');

const sharedInstance = Singleton.getInstance();

async function invokeAlias(req, res) {
    const aliasPath = path.join(sharedInstance.yaasServer.dataDir, 'alias', req.params.alias);
    const aliasExists = await fs.pathExists(aliasPath);
    if (!aliasExists) {
        return res.send({
            error: `The alias ${req.params.alias} does not exists.`
        });
    }
    const aliasData = await fs.readJson(aliasPath);
    const options = {
        method: aliasData.method,
        uri: `${req.protocol}://${req.get('host')}${aliasData.url}`,
        body: aliasData.payload
    };
    const response = await rp(options);
    return res.send(response);
}

module.exports = invokeAlias;
