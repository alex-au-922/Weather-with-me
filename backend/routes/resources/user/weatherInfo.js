const express = require("express");
const getLatestWeatherData =
  require("../../../databaseUtils/weatherDatabase/getLatestData").getLatestData;
const usernameCheck = require("../../middleware/resourceAuth/usernameCheck");
const router = express.Router();

router.use("/", usernameCheck);
router.get("/", async (req, res, next) => {
  const response = res.locals.response;
  const result = await getLatestWeatherData();
  response.success = true;
  response.result = result;
  res.send(JSON.stringify(response));
});

module.exports = router;
