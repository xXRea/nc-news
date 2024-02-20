const { getApiEndpoints } = require("../model/api.model");
const data = require("../db/data/test-data/index")


function getApi (req, res, next) {
    getApiEndpoints().then((endpoints) => {
        res.status(200).send({endpoints})
    }).catch((err) => {
        next(err)
    })
}

module.exports = { getApi }