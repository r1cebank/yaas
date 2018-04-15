const pkg = require('../../package.json');

module.exports =  (req, res) => res.send({
    service: pkg.name,
    version: pkg.version,
    description: pkg.description
});
