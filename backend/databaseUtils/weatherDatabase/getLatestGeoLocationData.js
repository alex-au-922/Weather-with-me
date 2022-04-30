const logger = require("../../generalUtils/getLogger").getLogger();
const connectWeatherDB =
  require("../../generalUtils/database").connectWeatherDB;

const geolocationSchema = require("../../backendConfig").databaseConfig
  .geolocationSchema;

const getLatestData = async function () {
  const weatherDB = await connectWeatherDB();
  try {
    const GeoLocation = weatherDB.model("GeoLocation", geolocationSchema);
    const allData = await GeoLocation.find();
    return { success: true, result: allData, error: null };
  } catch (error) {
    console.log(error);
    return { success: false, result: null, error };
  }
};

exports.getLatestData = getLatestData;
