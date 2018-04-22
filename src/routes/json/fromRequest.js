const dummyjson = require('dummy-json');

module.exports =  (req, res) => {
    try {
        const result = JSON.parse(dummyjson.parse(req.body));
        res.send(result);
    } catch (e) {
        res.status(400).send({
            error: 'Problem generating json, please check your template.'
        });
    }
};
