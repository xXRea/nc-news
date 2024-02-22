const {
  selectArticlesById,
  selectArticles,
  selectAllCommentsByArticleId,
  insertCommentByArticleId,
  updateArticleById
} = require("../model/articles.model");
const data = require("../db/data/test-data/index")

function getArticlesById(req, res, next) {
  const { article_id } = req.params;
  selectArticlesById(article_id)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticles(req, res, next) {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

function getAllCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  selectAllCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

function postComments(req, res, next) {
  const {article_id} = req.params
  const newComment = req.body
  insertCommentByArticleId(article_id, newComment)
  .then((newComment) => {
    res.status(201).send({ newComment })
  })
  .catch((err) => {
    next(err)
  })
}

function patchArticleById(req, res, next) {
  const {article_id} = req.params
  const newVote = req.body.inc_votes
  updateArticleById(article_id, newVote).then((updatedArticle) => {
    res.status(200).send({ updatedArticle })
  })
  .catch((err) => {
    next(err)
  })

}


module.exports = { getArticlesById, getArticles, getAllCommentsByArticleId, postComments, patchArticleById };
