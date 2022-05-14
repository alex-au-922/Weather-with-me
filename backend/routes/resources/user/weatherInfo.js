//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

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