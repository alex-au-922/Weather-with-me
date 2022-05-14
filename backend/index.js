//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

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
  sendData("weatherLoc")("updatedWeatherData", newLatestWeatherData)(
    true,
    null
  );
});
eventEmitter.on("userUpdate", async (userId = undefined) => {
  if (userId !== undefined) {
    const existsUser = await checkUserCredentialsById(userId);
    sendData("user")("updatedUserDatum", existsUser)(false, userId);
  }
  const result = await getLatestUserData();
  sendData("user")("updatedUserData", result)(true, -1);
});
eventEmitter.on("deleteUser", async (userId) => {
  sendData("user")("deleteUser", "")(false, userId);
  const result = await getLatestUserData();
  sendData("user")("updatedUserData", result)(true, -1);
});
eventEmitter.on("logUpdate", async () => {
  const result = await getLatestLogData();
  sendData("log")("updatedLogData", result)(true, null);
});
eventEmitter.on("commentUpdate", async () => {
  const result = await getLocationComment();
  sendData("comment")("updatedCommentData", result)(true, null);
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
