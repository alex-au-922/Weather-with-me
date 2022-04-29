const logger = require("../../generalUtils/getLogger").getLogger();
const connectWeatherDB =
  require("../../generalUtils/database").connectWeatherDB;
const weatherSchema = require("../../backendConfig.js").databaseConfig
  .weatherSchema;

const getLatestData = async function () {
  const weatherDB = await connectWeatherDB();
  try {
    const Weather = weatherDB.model("Weather", weatherSchema);
    const allData = await Weather.find();
    return { success: true, result: allData, error: null };
  } catch (error) {
    return { success: false, result: null, error };
  }
};

module.exports = getLatestData;
