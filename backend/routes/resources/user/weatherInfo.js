const express = require("express");
const getLatestWeatherData =
  require("../../../databaseUtils/weatherDatabase/getLatestData").getLatestData;
const usernameCheck = require("../../middleware/resourceAuth/usernameCheck");

const router = express.Router();

router.use("/", usernameCheck);
router.get("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const result = await getLatestWeatherData();
    response.success = true;
    response.result = result;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
