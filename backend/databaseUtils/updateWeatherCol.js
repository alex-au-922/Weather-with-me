const logger = require("../generalUtils/getLogger").getLogger();
const connectWeatherDB = require("../generalUtils/database").connectWeatherDB;
const mongoose = require("mongoose");
const weather = require("../backendConfig.js").databaseConfig.weatherSchema;
const geolocationSchema = require("../backendConfig.js").databaseConfig
  .geolocationSchema;

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

exports.updateHumidity = async function (humidityData) {
  const db = await connectWeatherDB();
  try {
    await insertOrUpdateHumid(humidityData);
  } catch (error) {
    logger.error(error);
  } finally {
    db.close();
  }
};

async function insertOrUpdateHumid(humidityData) {
  //TODO: to update the insert or update of humidity data
}

exports.updateWind = async function (humidityData) {
  const db = await connectWeatherDB();
  try {
    await insertOrUpdateWindData(humidityData);
  } catch (error) {
    logger.error(error);
  } finally {
    db.close();
  }
};

async function insertOrUpdateWindData(windData) {
  //TODO: to update the insert or update of wind data
}
