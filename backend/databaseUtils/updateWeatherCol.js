const logger = require("../generalUtils/getLogger").getLogger();
const connectWeatherDB = require("../generalUtils/database").connectWeatherDB;
const mongoose = require("mongoose");
const Weather = require("../backendConfig.js").Weather;
const GeoLocation = require("../backendConfig.js").GeoLocation;

exports.updateTemp = async function (airTempData) {
  const db = await connectWeatherDB();
  try {
    await insertOrUpdateTemp(airTempData);
  } catch (error) {
    logger.error(error);
  } finally {
    db.close();
  }
};

async function insertOrUpdateTemp(airTempData) {
  //TODO: to update the insert or update of air temperature data
}
