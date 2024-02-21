const { selectTopics } = require("../model/topics.model");
const data = require("../db/data/test-data/index")


function getTopics(req, res, next) {
    selectTopics().then((topics) => {
        res.status(200).send({ topics })
    }).catch((err) => {
        next(err)
    })
}




module.exports = {getTopics}