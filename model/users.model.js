const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const format = require("pg-format");
require("jest-sorted")

function selectAllUsers() {
    return db.query("SELECT * FROM users").then((result) => {
        return result.rows;
      });
}





module.exports = { selectAllUsers }