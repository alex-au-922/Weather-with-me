//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const apiEndpoint = require("./_index");
const apiDoc = require("./documentation");

const api = (app) => {
  app.use("/api/v1/doc", apiDoc);
  app.use("/api/v1", apiEndpoint);
  return app;
};

module.exports = api;
