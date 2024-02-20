const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

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
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles?article_id=9999")
      .expect(404)
      .then((response) => {
        const err = response.body
        expect(err.msg).toBe("Not found");
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
});
