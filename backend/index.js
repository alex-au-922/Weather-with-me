const app = require("./generalUtils/createExpressApp").createExpressApp();
const api = require("./routes");
const http = require("http");
const logger = require("./generalUtils/getLogger").getLogger();
const { createSocketServer } = require("./websocket");
const {
  createLocation,
} = require("./databaseUtils/weatherDatabase/createGeoLocCol.js");
const {
  updateWeather,
} = require("./databaseUtils/weatherDatabase/updateWeatherCol");
const {
  updateBackUpWeather,
} = require("./databaseUtils/weatherDatabase/backupWeatherCol");
const fetchAPIConfig = require("./backendConfig").fetchAPIConfig;
const {
  getLatestData: getLatestWeatherData,
  getLatestGeoLocationData,
  geoLocationToWeather,
} = require("./databaseUtils/weatherDatabase/getLatestData");

api(app);

const server = http.createServer(app);

server.listen(process.env.WEBSER_PORT, () => {
  logger.info(`Server is listening on port ${process.env.WEBSER_PORT}`);
});

const sendData = createSocketServer(server);

const updateWeatherData = async () => {
  await updateWeather();
  const weatherResults = await getLatestWeatherData();
  const geolocationResults = await getLatestGeoLocationData();
  const newLatestWeatherData = geoLocationToWeather(
    geolocationResults,
    weatherResults
  );
  sendData("weatherLoc")("weather", JSON.stringify(newLatestWeatherData));
};

const updateBackUpWeatherData = async () => {
  await updateBackUpWeather();
};

(async () => {
  await createLocation();
  setInterval(updateWeatherData, fetchAPIConfig.meanWeatherData.fetchDuration);
  setInterval(
    updateBackUpWeatherData,
    fetchAPIConfig.meanWeatherData.fetchDuration
  );
})();

exports.sendData = sendData;
