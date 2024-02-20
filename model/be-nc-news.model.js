const db = require("../db/connection");
const data = require("../db/data/test-data/index");

// require("jest-sorted")

function selectTopics() {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
}

function selectArticlesById(articleId) {
  return db
    .query(`SELECT * FROM articles WHERE article_Id = $1`, [articleId])
    .then((result) => {
      return result.rows[0];
    });
}

module.exports = {
  selectTopics,
  selectArticlesById,
};
