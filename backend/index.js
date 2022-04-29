const app = require("./generalUtils/createExpressApp").createExpressApp();
const api = require("./api");
const logger = require("./generalUtils/getLogger").getLogger();
const createWebSocketServer = require("./websocket");
const createLocation =
  require("./databaseUtils/weatherDatabase/createGeoLocCol.js").createLocation;
const {
  updateWeather,
} = require("./databaseUtils/weatherDatabase/updateWeatherCol");
const fetchAPIConfig = require("./backendConfig").fetchAPIConfig;
const getLatestData = require("./databaseUtils/weatherDatabase/getLatestData");
api(app);

const server = app.listen(process.env.APP_PORT, () => {
  logger.info(`Server is listening on port ${process.env.APP_PORT}`);
});

const sendData = createWebSocketServer(server);

const update = async () => {
  await updateWeather();
  const latestData = await getLatestData();
  console.log(latestData);
  sendData(JSON.stringify(latestData));
};

(async () => {
  await createLocation();
  setInterval(update, fetchAPIConfig.meanWeatherData.fetchDuration);
})();
