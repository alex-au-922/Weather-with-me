const express = require("express");
const router = express.Router();
const apiDoc = require("../apiSpec.json");
const swaggerUi = require("swagger-ui-express");

router.use("/", swaggerUi.serve, swaggerUi.setup(apiDoc, { explorer: true }));

module.exports = router;
