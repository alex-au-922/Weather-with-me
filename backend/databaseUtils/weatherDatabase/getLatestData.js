const logger = require("../../generalUtils/getLogger").getLogger();
const connectWeatherDB =
  require("../../generalUtils/database").connectWeatherDB;
const weatherSchema = require("../../backendConfig.js").databaseConfig
  .weatherSchema;
const geolocationSchema = require("../../backendConfig").databaseConfig
  .geolocationSchema;

const getLatestData = async function () {
  const weatherDB = await connectWeatherDB();
  const response = {
    success: false,
    error: null,
    errorType: null,
    result: null,
  };
  try {
    const GeoLocation = weatherDB.model("GeoLocation", geolocationSchema);
    const Weather = weatherDB.model("Weather", weatherSchema);
    const result = await Weather.find().populate("locationId");
    response.success = true;
    response.result = result;
  } catch (error) {
    logger.error(error);
    response.error = error;
    response.errorType = "UNKNOWN_ERROR";
  }
  return response;
};

exports.getLatestData = getLatestData;
