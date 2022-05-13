const express = require("express");
const {
  getLatestData: getLatestWeatherData,
  getLatestGeoLocationData,
  geoLocationToWeather,
} = require("../../../databaseUtils/weatherDatabase/getLatestData");
const usernameCheck = require("../../middleware/resourceAuth/usernameCheck");

const router = express.Router();

router.use("/", usernameCheck);
router.get("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const weatherResults = await getLatestWeatherData();
    const geolocationResults = await getLatestGeoLocationData();
    const newLatestWeatherData = geoLocationToWeather(
      geolocationResults,
      weatherResults
    );
    response.success = true;
    response.result = newLatestWeatherData;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});

module.exports = router;