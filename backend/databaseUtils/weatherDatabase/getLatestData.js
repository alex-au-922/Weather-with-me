const { DatabaseError } = require("../../errorConfig");

const logger = require("../../generalUtils/getLogger").getLogger();
const connectWeatherDB =
  require("../../generalUtils/database").connectWeatherDB;
const weatherSchema = require("../../backendConfig.js").databaseConfig
  .weatherSchema;
const geolocationSchema = require("../../backendConfig").databaseConfig
  .geolocationSchema;

const getLatestData = async function () {
  try {
    const weatherDB = await connectWeatherDB();
    const GeoLocation = weatherDB.model("GeoLocation", geolocationSchema);
    const Weather = weatherDB.model("Weather", weatherSchema);
    const result = await Weather.find().populate("locationId");
    return result;
  } catch (error) {
    throw new DatabaseError(error);
  }
};

exports.getLatestData = getLatestData;
