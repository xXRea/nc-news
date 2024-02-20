const { selectTopics, selectArticlesById } = require("../model/be-nc-news.model");
const data = require("../db/data/test-data/index")


function getTopics(req, res, next) {
    selectTopics().then((topics) => {
        res.status(200).send({ topics })
    }).catch((err) => {
        next(err)
    })
}

function getArticlesById(req, res, next) {
    const articleId = req.params.article_id;
    selectArticlesById(articleId).then((articles) => {
        res.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
  
}



module.exports = {getTopics, getArticlesById}