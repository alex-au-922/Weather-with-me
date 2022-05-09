const logger = require("../../generalUtils/getLogger").getLogger();
const connectWeatherDB =
  require("../../generalUtils/database").connectWeatherDB;
const { collectionExists } = require("../../generalUtils/database");
const backupWeatherSchema = require("../../backendConfig.js").databaseConfig
  .backupWeatherSchema;
const geolocationSchema = require("../../backendConfig.js").databaseConfig
  .geolocationSchema;
const fetchAirTemp = require("../../fetcherUtils/csv/meanAirTemp");
const fetchRelHumid = require("../../fetcherUtils/csv/meanRelHumid");
const fetchWindDirection = require("../../fetcherUtils/csv/meanWindDirection");

const updateBackUpWeather = async function () {
  await updateTemp();
  await updateRelHumid();
  await updateWind();
};

const updateTemp = async function () {
  logger.info("Updating temperature!");
  await updateData(fetchAirTemp.parsedFetch);
};

const updateRelHumid = async function () {
  logger.info("Updating relative humidity!");
  await updateData(fetchRelHumid.parsedFetch);
};

const updateWind = async function () {
  logger.info("Updating wind data!");
  await updateData(fetchWindDirection.parsedFetch);
};

const updateData = async function (fetchFunction) {
  const weatherDB = await connectWeatherDB();
  try {
    if (!(await collectionExists(weatherDB, "backupweathers"))) {
      const BackUpWeather = weatherDB.model(
        "BackUpWeather",
        backupWeatherSchema
      );
      await BackUpWeather.createCollection();
    }
    const weatherData = await fetchFunction();
    const transformedData = await transformLocField(weatherDB, weatherData);
    await insertOnlyNewWeatherData(weatherDB, transformedData);
  } catch (error) {
    logger.error(error.message);
  }
};

async function insertOnlyNewWeatherData(weatherDB, weatherData) {
  await Promise.all(
    weatherData.map(
      async (weatherDatum) => await insertOnlyNewDatum(weatherDB, weatherDatum)
    )
  );
}

async function insertOnlyNewDatum(weatherDB, weatherDatum) {
  const BackUpWeather = weatherDB.model("BackupWeather", backupWeatherSchema);
  const { time, locationId } = weatherDatum;
  const recordExists = await BackUpWeather.findOne({ locationId, time });
  if (recordExists === null) {
    const result = await BackUpWeather.create(weatherDatum);
  }
}

async function transformLocField(weatherDB, data) {
  const transformedData = await Promise.all(
    data.map(async (datum) => await transformLocId(weatherDB, datum))
  );
  const filteredTransformedData = transformedData.filter(
    (trasnformedDatum) => trasnformedDatum !== null
  );
  return filteredTransformedData;
}

async function transformLocId(weatherDB, datum) {
  const { location } = datum;
  const GeoLocation = weatherDB.model("GeoLocation", geolocationSchema);
  const geolocationDatum = await GeoLocation.findOne({
    name: location,
  });
  if (geolocationDatum === null) {
    return null;
  }
  const geolocationObject = geolocationDatum.toObject();
  const newDatum = { ...datum, locationId: geolocationObject._id };
  return newDatum;
}

module.exports = { updateBackUpWeather };
