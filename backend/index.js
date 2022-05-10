const app = require("./generalUtils/createExpressApp").createExpressApp();
const api = require("./routes");
const logger = require("./generalUtils/getLogger").getLogger();
const {
  createWeatherWebSocketServer,
  weatherWebSocketClients,
} = require("./websocket/weather");
const {
  createUserWebSocketServer,
  userWebSocketClients,
} = require("./websocket/user");
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
const getLatestUserData =
  require("./databaseUtils/userDatabase/getLatestData").getLatestData;
const { eventEmitter } = require("./routes/_emitEvent");
const {
  checkUserCredentialsById,
  cleanUserData,
} = require("./generalUtils/userCreds/username");
api(app);

const server = app.listen(process.env.WEBSER_PORT, () => {
  logger.info(`Server is listening on port ${process.env.WEBSER_PORT}`);
});

const sendWeatherData = createWeatherWebSocketServer(server);
const sendUserData = createUserWebSocketServer(server);

const updateWeatherData = async () => {
  await updateWeather();
  const weatherResults = await getLatestWeatherData();
  const geolocationResults = await getLatestGeoLocationData();
  const newLatestWeatherData = geoLocationToWeather(
    geolocationResults,
    weatherResults
  );
  sendWeatherData(JSON.stringify(newLatestWeatherData));
};

eventEmitter.on("userUpdate", async (ip) => {
  const updatedUserId = userWebSocketClients[ip].userId;
  const newUserInfo = await checkUserCredentialsById(updatedUserId);
  const cleantUserInfo = cleanUserData(newUserInfo);
  sendUserData(JSON.stringify({ type: "auth", data: cleantUserInfo }), ip);
});
const updateBackUpWeatherData = async () => {
  await updateBackUpWeather();
};

eventEmitter.on("updateUserData", async () => {
  const latestData = await getLatestUserData();
  sendUserData(JSON.stringify(latestData));
});

(async () => {
  await createLocation();
  setInterval(updateWeatherData, fetchAPIConfig.meanWeatherData.fetchDuration);
  setInterval(
    updateBackUpWeatherData,
    fetchAPIConfig.meanWeatherData.fetchDuration
  );
})();
