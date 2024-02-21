const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const format = require("pg-format");


function selectArticlesById(articleId) {
    return db.query(`SELECT * FROM articles WHERE article_Id = $1`, [articleId])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({status: 404, msg: "article does not exist"})
        }
        return result.rows[0];
      });
  }
  
  function selectArticles() {
    return db.query(`SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.body) 
    AS comment_count 
    FROM articles 
    JOIN comments ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`
    ).then((result) => {
      return result.rows;
    });
  
  }


  module.exports = {
    selectArticlesById,
    selectArticles
  };