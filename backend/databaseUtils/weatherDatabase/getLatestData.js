const { DatabaseError } = require("../../errorConfig");

const logger = require("../../generalUtils/getLogger").getLogger();
const connectWeatherDB =
  require("../../generalUtils/database").connectWeatherDB;
const weatherSchema = require("../../backendConfig.js").databaseConfig
  .weatherSchema;
const geolocationSchema = require("../../backendConfig").databaseConfig
  .geolocationSchema;

const getLatestData = async () => {
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

const getLatestGeoLocationData = async () => {
  try {
    const weatherDB = await connectWeatherDB();
    const GeoLocation = weatherDB.model("GeoLocation", geolocationSchema);
    const result = await GeoLocation.find();
    return result;
  } catch (error) {
    throw new DatabaseError(error);
  }
};

const geoLocationToWeather = (geolocationResults, weatherResults) => {
  return geolocationResults.map((geolocationResult) => {
    const geolocationId = geolocationResult._id;
    for (const weatherResult of weatherResults) {
      if (weatherResult.locationId._id.toString() === geolocationId.toString())
        return weatherResult;
    }
    const newWeatherResult = {
      _id: null,
      time: null,
      locationId: geolocationResult,
      temperature: null,
      updatedTime: null,
      __v: null,
      tenMinMaxGust: null,
      tenMinMeanWindDir: null,
      tenMinMeanWindSpeed: null,
    };
    return newWeatherResult;
  });
};

exports.getLatestData = getLatestData;
exports.getLatestGeoLocationData = getLatestGeoLocationData;
exports.geoLocationToWeather = geoLocationToWeather;
