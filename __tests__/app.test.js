const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
require("jest-sorted")

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
        expect(typeof article.article_img_url).toBe("string")
        
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((response) => {
        const error = response.body.msg
        expect(error).toBe("article does not exist");
      })

      })
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
  test(
    "GET:200 status responds with the array of articles, all articles sorted based on date (created_by) in descending order", () => {
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const article = res.body.articles;
        expect(article).toBeSortedBy('created_at', {descending: true})

      })
    }
  );
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
          expect(typeof comment.comment_id).toBe('number');
          expect(comment.article_id).toBe(9);
          expect(typeof comment.votes).toBe('number')
          expect(typeof comment.author).toBe("string")
          expect(typeof comment.body).toBe('string')
          expect(typeof comment.created_at).toBe("string")
        });
      });
  });
  test("GET:200 status responds with the most recent comments first.", () => {
    return request(app)
    .get("/api/articles/9/comments")
    .expect(200)
    .then((res) => {
      const comment = res.body.comments;
      expect(comment).toBeSortedBy('created_at', {descending: true})

    })
  })
  test("GET:204 responds with a message of no comments when the articles doesnt have any comments", () => {
    return request(app)
    .get("/api/articles/13/comments")
    .expect(404)
    .then((res) => {
      const err = res.body.msg

      expect(err).toBe("no comments on this article");
    })
    })
  })

