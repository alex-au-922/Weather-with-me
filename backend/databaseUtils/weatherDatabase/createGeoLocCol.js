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
  const db = await connectWeatherDB();
  try {
    if (!(await collectionExists(db, "geolocations"))) {
      const plainText = await readFile(`${__dirname}/locations.json`);
      const geoLocationJson = JSON.parse(plainText);
      const cleantGeoLocationJson = await cleanGeoLocationJson(geoLocationJson);
      // const mappedGeoLocationJson = await mapGeoLocationName(cleantGeoLocationJson);
      logger.info("Creating the geolocations Collection...");
      await insertLocation(cleantGeoLocationJson);
    } else {
      logger.info("The collection geolocations already exists");
    }
  } catch (error) {
    console.log(error);
    logger.error(error);
  }
};

async function cleanGeoLocationJson(geoLocationJson) {
  return geoLocationJson.features.map((feature) => {
    const newObject = {};
    newObject["name"] = feature.properties["Facility Name"];
    newObject["address"] = feature.properties.Address;
    const [latitude, longitude] = feature.geometry.coordinates;
    newObject["latitude"] = latitude;
    newObject["longitude"] = longitude;
    return newObject;
  });
}

async function insertLocation(data) {
  const GeoLocation = mongoose.model("GeoLocation", geolocationSchema);
  await GeoLocation.createCollection();
  await GeoLocation.collection.insertMany(data, {
    ordered: true,
  });

  logger.info(`Inserted locations into geolocations collection.`);
}
