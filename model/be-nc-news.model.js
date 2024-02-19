const db = require("../db/connection")
const data = require("../db/data/test-data/index")

// require("jest-sorted")

function selectTopics() {
    return db.query
    ("SELECT * FROM topics").then((result) => {
        return result.rows
    })
}

module.exports = {
    selectTopics
}