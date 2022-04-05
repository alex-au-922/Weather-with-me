const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

exports.createExpressApp = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  return app;
};
