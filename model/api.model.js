const fs = require("fs/promises");


function getApiEndpoints() {
  return fs.readFile("endpoints.json", "utf8").then((data) => {
    const endpoints = JSON.parse(data);

    return endpoints;
  });
}

module.exports = { getApiEndpoints };
