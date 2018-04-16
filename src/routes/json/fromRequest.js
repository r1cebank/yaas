const dummyjson = require('dummy-json');

module.exports =  (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(dummyjson.parse(req.body));
};
