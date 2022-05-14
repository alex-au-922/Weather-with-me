//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const express = require("express");
const router = express.Router();
const apiDoc = require("../apiSpec.json");
const swaggerUi = require("swagger-ui-express");

router.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(apiDoc, {
    explorer: true,
  })
);

module.exports = router;
