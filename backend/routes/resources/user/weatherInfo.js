const express = require("express");
const {
  getLatestData: getLatestWeatherData,
  getLatestGeoLocationData,
  geoLocationToWeather,
  getLatestBackupData,
} = require("../../../databaseUtils/weatherDatabase/getLatestData");
const usernameCheck = require("../../middleware/resourceAuth/usernameCheck");
const {
  findLocationInfoByName,
} = require("../../../generalUtils/location/locationName.js");

const router = express.Router();

router.use("/", usernameCheck);
router.get("/:location", async (req, res, next) => {
  const location = req.params;
  const locId = findLocationInfoByName(location).locationId;
  const response = res.locals.response;
  try {
    if (location === undefined) {
      const weatherResults = await getLatestWeatherData();
      const geolocationResults = await getLatestGeoLocationData();
      const newLatestWeatherData = geoLocationToWeather(
        geolocationResults,
        weatherResults
      );
      response.success = true;
      response.result = newLatestWeatherData;
      res.send(JSON.stringify(response));
    } else {
      const backupWeatherResults = await getLatestBackupData(locId);
      const geolocationResults = await getLatestGeoLocationData();
      const newLatestBackupWeatherData = geoLocationToWeather(
        geolocationResults,
        backupWeatherResults
      );
      response.success = true;
      response.result = newLatestBackupWeatherData;
      res.send(JSON.stringify(response));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
