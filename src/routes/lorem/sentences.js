const loremIpsum = require('lorem-ipsum');

module.exports =  (req, res) => {
    res.send(loremIpsum({
        count: parseInt(req.query.count, 10) || 1,
        units: 'sentences'
    }));
};
