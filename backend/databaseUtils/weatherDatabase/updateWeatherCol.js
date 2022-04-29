const logger = require("../../generalUtils/getLogger").getLogger();
const connectWeatherDB =
  require("../../generalUtils/database").connectWeatherDB;
const { collectionExists } = require("../../generalUtils/database");
const weatherSchema = require("../../backendConfig.js").databaseConfig
  .weatherSchema;
const geolocationSchema = require("../../backendConfig.js").databaseConfig
  .geolocationSchema;
const fetchAirTemp = require("../../fetcherUtils/csv/meanAirTemp");
const fetchRelHumid = require("../../fetcherUtils/csv/meanRelHumid");
const fetchWindDirection = require("../../fetcherUtils/csv/meanWindDirection");

const updateWeather = async function () {
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
    if (!(await collectionExists(weatherDB, "weathers"))) {
      const Weather = weatherDB.model("Weather", weatherSchema);
      await Weather.createCollection();
    }
    const weatherData = await fetchFunction();
    const transformedData = await transformLocField(weatherDB, weatherData);
    await insertOrUpdateWeatherData(weatherDB, transformedData);
  } catch (error) {
    console.log(error);
    logger.error(error);
  }
};

async function insertOrUpdateWeatherData(weatherDB, weatherData) {
  //TODO: to update the insert or update of air temperature data
  await Promise.all(
    weatherData.map(
      async (weatherDatum) =>
        await insertOrUpdateWeatherDatum(weatherDB, weatherDatum)
    )
  );
}

async function insertOrUpdateWeatherDatum(weatherDB, weatherDatum) {
  const Weather = weatherDB.model("Weather", weatherSchema);
  const { locationId } = weatherDatum;
  const recordExists = await Weather.findOne({ locationId });
  if (recordExists !== null) {
    const result = await Weather.updateOne({ locationId }, weatherDatum);
  } else {
    await Weather.create(weatherDatum);
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

// module.exports = { updateTemp, updateRelHumid, updateWind };
module.exports = { updateWeather };
