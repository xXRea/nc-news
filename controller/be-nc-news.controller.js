const { selectTopics } = require("../model/be-nc-news.model");
const data = require("../db/data/test-data/index")
const fs = require("fs")


function getTopics(req, res, next) {
    selectTopics().then((topics) => {
        res.status(200).send({ topics })
    }).catch((err) => {
        next(err)
    })
}



   







module.exports = {getTopics}