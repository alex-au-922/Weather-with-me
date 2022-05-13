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
const getLatestUserData =
  require("./databaseUtils/userDatabase/getLatestData").getLatestData;
const { eventEmitter, emitWeatherLocUpdate } = require("./routes/_emitEvent");
const {
  checkUserCredentialsById,
} = require("./generalUtils/userCreds/username");
const getLatestLogData =
  require("./databaseUtils/logDatabase/getLatestData").getLatestData;

const {
  getLocationComment,
} = require("./databaseUtils/weatherDatabase/updateLocation");
api(app);

process.setMaxListeners(0);

const server = http.createServer(app);

server.listen(process.env.WEBSER_PORT, () => {
  logger.info(`Server is listening on port ${process.env.WEBSER_PORT}`);
});

const sendData = createSocketServer(server);

const updateWeatherData = async () => {
  await updateWeather();
  await emitWeatherLocUpdate();
};

eventEmitter.on("crawlNewWeather", updateWeatherData);
eventEmitter.on("weatherLocUpdate", async () => {
  const weatherResults = await getLatestWeatherData();
  const geolocationResults = await getLatestGeoLocationData();
  const newLatestWeatherData = geoLocationToWeather(
    geolocationResults,
    weatherResults
  );
  sendData("weatherLoc")("updatedWeatherData", newLatestWeatherData)();
});
eventEmitter.on("userUpdate", async (admin = true, userId = undefined) => {
  if (userId !== undefined) {
    const existsUser = await checkUserCredentialsById(userId);
    sendData("user")("updatedUserDatum", existsUser)(false, userId);
  }
  const result = await getLatestUserData();
  sendData("user")("updatedUserData", result)(admin, undefined);
});
eventEmitter.on("deleteUser", async (admin = true, userId) => {
  sendData("user")("deleteUser")(false, userId);
  const result = await getLatestUserData();
  sendData("user")("updatedUserData", result)(admin, undefined);
});
eventEmitter.on("logUpdate", async () => {
  const result = await getLatestLogData();
  sendData("log")("updatedLogData", result)();
});
eventEmitter.on("commentUpdate", async () => {
  const result = await getLocationComment();
  console.log("update comment!");
  sendData("comment")("updatedCommentData", result)();
});

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
