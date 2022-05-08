const apiEndpoint = require("./_index");
const apiDoc = require("./documentation");

const api = (app) => {
  app.use("/api/v1/doc", apiDoc);
  app.use("/api/v1", apiEndpoint);
  return app;
};

module.exports = api;
