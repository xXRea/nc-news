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
        const endpoint = response.body.endpoints 
        expect(endpoints).toEqual(endpoint);
      });
  });
});
