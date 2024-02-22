const data = require("../db/data/test-data/index")
const { selectAllUsers } = require("../model/users.model")
require("jest-sorted")

function getAllUsers(req, res, next) {
    selectAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
}







module.exports = { getAllUsers }