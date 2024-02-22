const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const format = require("pg-format");

function selectArticlesById(article_Id) {
  return db
    .query(`SELECT * FROM articles WHERE article_Id = $1`, [article_Id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return result.rows[0];
    });
}

function selectArticles() {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.body) 
    AS comment_count 
    FROM articles 
    JOIN comments ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`
    )
    .then((result) => {
      return result.rows;
    });
}

function selectAllCommentsByArticleId(article_id) {
  return db
    .query(
      `SELECT * FROM comments
     WHERE comments.article_id = $1
     ORDER BY comments.created_at DESC`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "no comments on this article",
        });
      }
      return result.rows;
    });
}

function insertCommentByArticleId(article_id, newComment) {
  const newValues = [article_id, newComment.username, newComment.body];
  return db
    .query(
      `INSERT INTO comments
    (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
      newValues
    )
    .then((result) => {
      return result.rows[0];
    });
}

function updateArticleById(article_id, newVote) {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [newVote, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Failed to update becasue the article does not exist" });
      }
      return result.rows[0];
    });
}

module.exports = {
  selectArticlesById,
  selectArticles,
  selectAllCommentsByArticleId,
  insertCommentByArticleId,
  updateArticleById,
};
