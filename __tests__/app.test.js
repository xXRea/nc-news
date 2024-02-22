const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
require("jest-sorted");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("GET:200 status responds with an array of topics with the properties of slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topic = response.body.topics;
        expect(Array.isArray(topic)).toBe(true);
        expect(topic.length).toBe(3);
        topic.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
  test("GET: 404 status responds with an error messages when trying to access an invalid api or the one that does not exist", () => {
    return request(app)
      .get("/api/invalid")
      .expect(404)
      .then((response) => {
        const error = response.body;
        expect(error.msg).toBe("Not found");
      });
  });
});

describe("GET /api", () => {
  test("GET:200 status responds with object of available endpoints with our API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endpoints = require("../endpoints.json");
        const endpoint = response.body.endpoints;
        expect(endpoints).toEqual(endpoint);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET:200 status responds with the correct article object", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((res) => {
        const article = res.body.articles;
        expect(article.article_id).toBe(2);
        expect(article.title).toBe("Sony Vaio; or, The Laptop");
        expect(article.author).toBe("icellusedkars");
        expect(typeof article.body).toBe("string");
        expect(article.created_at).toBe("2020-10-16T05:03:00.000Z");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe("article does not exist");
      });
  });
});
test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
  return request(app)
    .get("/api/articles/not-a-article")
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad request");
    });
});

describe("GET /api/articles", () => {
  test("GET:200 status responds with an array of articles with expected properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const article = res.body.articles;
        article.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
        });
      });
  });
  test("GET:200 status responds with an array of articles with expected properties along with comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const article = res.body.articles;
        expect(article.hasOwnProperty("article")).toBe(false);
        article.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });
  test("GET:200 status responds with the array of articles, all articles sorted based on date (created_by) in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const article = res.body.articles;
        expect(article).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET:200 status responds with an array of comments with the requested article id with each comment having the correct properties", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then((res) => {
        const comment = res.body.comments;
        expect(Array.isArray(comment)).toBe(true);
        expect(comment.length).toBe(2);
        comment.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(comment.article_id).toBe(9);
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.created_at).toBe("string");
        });
      });
  });
  test("GET:200 status responds with the most recent comments first.", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then((res) => {
        const comment = res.body.comments;
        expect(comment).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET:404 responds with a message of no comments when the articles doesnt have any comments", () => {
    return request(app)
      .get("/api/articles/13/comments")
      .expect(404)
      .then((res) => {
        const err = res.body.msg;
        expect(err).toBe("no comments on this article");
      });
  });
});

describe("POST: /api/articles/:article_id/comments ", () => {
  test("POST: 201 status responds with the addition of the new comment in the database", () => {
    const newComment = {
      username: "lurker",
      body: "Why do they call it rush hour when nothing moves?",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then((res) => {
        const newComment = res.body.newComment;
        expect(newComment.article_id).toBe(2);
        expect(newComment.author).toBe("lurker");
        expect(newComment.body).toBe(
          "Why do they call it rush hour when nothing moves?"
        );
      });
  });
  test("POST: 404 error is returned when a username is given that does not exist", () => {
    const newComment = {
      username: "invalidUsername",
      body: "Why do they call it rush hour when nothing moves?",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        const err = res.body.msg;
        expect(err).toBe("this username does not exist");
      });
  });
});
test("POST: 400 error is returned when one or all of the required fields are left null", () => {
  const newComment = {
    username: "lurker",
    body: null,
  };
  return request(app)
    .post("/api/articles/2/comments")
    .send(newComment)
    .expect(400)
    .then((res) => {
      const err = res.body.msg;
      expect(err).toBe("Bad request");
    });
});

describe("PATCH: 200 /api/articles/:article_id", () => {
  test("PATCH: 200 status responds with the updated article object based on article id", () => {
    const updatedArticle = { inc_votes: 4 };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedArticle)
      .expect(200)
      .then((res) => {
        const updatedArticle = res.body.updatedArticle;
        expect(updatedArticle.article_id).toBe(1);
        expect(updatedArticle.votes).toBe(104);
        expect(updatedArticle.author).toBe("butter_bridge");
        expect(updatedArticle.body).toBe("I find this existence challenging");
        expect(updatedArticle.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(updatedArticle.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("PATCH: 404 error is given when attempting to access an id that does not exist", () => {
    return request(app)
      .patch("/api/articles/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe( "Failed to update becasue the article does not exist");
      });
  });
  test("PATCH: 400 error is given when attempting to update the vote field with a value that is not a number ", () => {
    const updatedArticle = { inc_votes: "invalid" }
    return request(app)
    .patch("/api/articles/4")
    .send(updatedArticle)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request")
      })   
  });
});
