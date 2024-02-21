const { selectArticlesById, selectArticles } = require("../model/articles.model");
// const data = require("../db/data/test-data/index")


function getArticlesById(req, res, next) {
    const {article_id} = req.params;
    selectArticlesById(article_id).then((articles) => {
        res.status(200).send({articles})
    }).catch((err) => {
        next(err)
      
    })
  
}

function getArticles(req, res, next) {
    selectArticles().then((articles) => {
        res.status(200).send({ articles })
    }).catch((err) => {
        next(err)
    })
}

module.exports = { getArticlesById, getArticles}