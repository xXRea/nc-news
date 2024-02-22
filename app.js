const express = require("express");
const { getTopics } = require("./controller/topics.controller");
const { getApi } = require("./controller/api.controller")
const { getArticlesById, getArticles, getAllCommentsByArticleId, postComments, patchArticleById} = require("./controller/articles.controller")

const app = express();
app.use(express.json());



app.get("/api/topics", getTopics)
app.get("/api", getApi)
app.get("/api/articles/:article_id", getArticlesById)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postComments)

app.patch("/api/articles/:article_id", patchArticleById)


app.all("/api/*", (req, res, next) => {
  res.status(404).send({ msg: "Not found" });
});



app.use((err, req, res, next) => {
  if(err.status && err.msg) {
    res.status(err.status).send({msg: err.msg})
  }
  if (err.code === "23502" || err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    if ( err.code === "23503") {
      res.status(404).send({ msg: "this username does not exist"})
    } else {
  res.status(500).send({ msg: "Internal server error!" });
  }
  next(err)
}
}
);



module.exports = app;






