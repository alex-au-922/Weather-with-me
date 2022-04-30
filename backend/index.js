const app = require("./generalUtils/createExpressApp").createExpressApp();
const api = require("./api");
const logger = require("./generalUtils/getLogger").getLogger();
const createWeatherWebSocketServer =
  require("./websocket/weather").createWeatherWebSocketServer;
const createUserWebSocketServer =
  require("./websocket/user").createUserWebSocketServer;
const createLocation =
  require("./databaseUtils/weatherDatabase/createGeoLocCol.js").createLocation;
const {
  updateWeather,
} = require("./databaseUtils/weatherDatabase/updateWeatherCol");
const fetchAPIConfig = require("./backendConfig").fetchAPIConfig;
const getLatestWeatherData =
  require("./databaseUtils/weatherDatabase/getLatestWeatherData").getLatestData;
const getLatestUserData =
  require("./databaseUtils/userDatabase/getLatestData").getLatestData;
  
const eventEmitter = require("./api/_eventEmitter");
api(app);

const server = app.listen(process.env.WEBSER_PORT, () => {
  logger.info(`Server is listening on port ${process.env.WEBSER_PORT}`);
});

const sendWeatherData = createWeatherWebSocketServer(server);
const sendUserData = createUserWebSocketServer(server);

const updateWeatherData = async () => {
  await updateWeather();
  const latestData = await getLatestWeatherData();
  sendWeatherData(JSON.stringify(latestData));
};

eventEmitter.on("updateUserData", async () => {
  const latestData = await getLatestUserData();
  sendUserData(JSON.stringify(latestData));
});

(async () => {
  await createLocation();
  setInterval(updateWeatherData, fetchAPIConfig.meanWeatherData.fetchDuration);
})();
