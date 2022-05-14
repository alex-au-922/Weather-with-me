//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const createExpressApp = () => {
  const app = express();
  app.use(methodOverride());
  app.use(bodyParser.json());
  app.use(cors());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  return app;
};

exports.createExpressApp = createExpressApp;
