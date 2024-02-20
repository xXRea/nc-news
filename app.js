const express = require("express");
const { getTopics } = require("./controller/be-nc-news.controller");
const { getApi } = require("./controller/api.controller")

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.all("/api/*", (req, res, next) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((err, request, response, next) => {

  if (err.code === "23502" || err.code === "22P02") {
    response.status(400).send({ msg: "Bad request" });
  }
  next(err);

  response.status(500).send({ msg: "Internal server error!" });
});

module.exports = app;
