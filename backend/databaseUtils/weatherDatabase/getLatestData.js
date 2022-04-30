const logger = require("../../generalUtils/getLogger").getLogger();
const connectWeatherDB =
  require("../../generalUtils/database").connectWeatherDB;
const weatherSchema = require("../../backendConfig.js").databaseConfig
  .weatherSchema;
const geolocationSchema = require("../../backendConfig").databaseConfig
  .geolocationSchema;

const getLatestData = async function () {
  const weatherDB = await connectWeatherDB();
  try {
    const GeoLocation = weatherDB.model("GeoLocation", geolocationSchema);
    const Weather = weatherDB.model("Weather", weatherSchema);
    const allData = await Weather.find().populate("locationId");
    return { success: true, result: allData, error: null };
  } catch (error) {
    console.log(error);
    return { success: false, result: null, error };
  }
};

exports.getLatestData = getLatestData;
