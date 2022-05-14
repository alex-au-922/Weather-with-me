//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const databaseUtils = require("../../generalUtils/database");
const connectWeatherDB = databaseUtils.connectWeatherDB;
const collectionExists = databaseUtils.collectionExists;
const geolocationSchema = require("../../backendConfig.js").databaseConfig
  .geolocationSchema;
const mongoose = require("mongoose");
const logger = require("../../generalUtils/getLogger").getLogger();
const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);

exports.createLocation = async function () {
  const weatherDB = await connectWeatherDB();
  try {
    if (!(await collectionExists(weatherDB, "geolocations"))) {
      const plainText = await readFile(`${__dirname}/locations.json`);
      const geoLocationJson = JSON.parse(plainText);
      const cleantGeoLocationJson = await cleanGeoLocationJson(geoLocationJson);
      logger.info("Creating the geolocations Collection...");
      await insertLocation(weatherDB, cleantGeoLocationJson);
    } else {
      logger.info("The collection geolocations already exists");
    }
  } catch (error) {
    logger.error(error);
  }
};

async function cleanGeoLocationJson(geoLocationJson) {
  return geoLocationJson.features.map((feature) => {
    const newObject = {};
    newObject["name"] = feature.properties["Facility Name"];
    newObject["address"] = feature.properties.Address;
    const [longitude, latitude] = feature.geometry.coordinates;
    newObject["latitude"] = latitude;
    newObject["longitude"] = longitude;
    return newObject;
  });
}

async function insertLocation(weatherDB, data) {
  const GeoLocation = weatherDB.model("GeoLocation", geolocationSchema);
  await GeoLocation.createCollection();
  await GeoLocation.collection.insertMany(data, {
    ordered: true,
  });

  logger.info(`Inserted locations into geolocations collection.`);
}
