const express = require("express");
const getLatestWeatherData =
  require("../../../databaseUtils/weatherDatabase/getLatestData").getLatestData;
const usernameCheck = require("../../middleware/resourceAuth/usernameCheck");
const router = express.Router();

router.use("/", usernameCheck);
router.post("/", async (req, res, next) => {
  const response = res.locals.response;
  const result = await getLatestWeatherData();
  response.success = true;
  response.result = result;
  next();
});

module.exports = router;
