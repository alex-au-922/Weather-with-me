//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const events = require("events");
const eventEmitter = new events.EventEmitter();
const {
  getLatestData: getLatestLogData,
} = require("../databaseUtils/logDatabase/getLatestData");
const {
  getLatestData: getLatestUserData,
} = require("../databaseUtils/userDatabase/getLatestData");
const {
  getLatestData: getLatestWeatherData,
  getLatestGeoLocationData,
  geoLocationToWeather,
} = require("../databaseUtils/weatherDatabase/getLatestData");
const {
  getLocationComment,
} = require("../databaseUtils/weatherDatabase/updateLocation");
const {
  updateWeather,
} = require("../databaseUtils/weatherDatabase/updateWeatherCol");
const {
  checkUserCredentialsById,
} = require("../generalUtils/userCreds/username");

//TODO: update the user and the admin under the channel of
//TODO: user
const emitUserUpdate = async (userId = undefined) => {
  // if (userId !== undefined) {
  //   const existsUser = await checkUserCredentialsById(userId);
  //   sendData("user")("updatedUserDatum", existsUser)(false, userId);
  // }
  // const result = await getLatestUserData();
  // sendData("user")("updatedUserData", result)(true, undefined);
  eventEmitter.emit("userUpdate", userId);
};

const emitDeleteUser = async (userId) => {
  // sendData("user")("deleteUser")(false, userId);
  // const result = await getLatestUserData();
  // sendData("user")("updatedUserData", result)(true, undefined);
  eventEmitter.emit("deleteUser", userId);
};

//TODO: update all people connected to the channel
//TODO: weather
const emitWeatherLocUpdate = async () => {
  // const weatherResults = await getLatestWeatherData();
  // const geolocationResults = await getLatestGeoLocationData();
  // const newLatestWeatherData = geoLocationToWeather(
  //   geolocationResults,
  //   weatherResults
  // );
  // sendData("weatherLoc")("updatedWeatherData", newLatestWeatherData)();
  eventEmitter.emit("weatherLocUpdate");
};

const emitCrawlLatestWeather = async () => {
  // await updateWeather();
  // await emitWeatherLocUpdate();
  eventEmitter.emit("crawlNewWeather");
};

//TODO: update all people connected to the channel
//TODO: log
const emitLogUpdate = async () => {
  // const result = await getLatestLogData();
  // sendData("log")("updatedLogData", result)();
  eventEmitter.emit("logUpdate");
};

//TODO: update all people connected to the channel
//TODO: comment
const emitCommentUpdate = async () => {
  // const result = await getLocationComment();
  // console.log("update comment!");
  // sendData("comment")("updatedCommentData", result)();
  eventEmitter.emit("commentUpdate");
};

exports.eventEmitter = eventEmitter;
exports.emitUserUpdate = emitUserUpdate;
exports.emitDeleteUser = emitDeleteUser;
exports.emitWeatherLocUpdate = emitWeatherLocUpdate;
exports.emitLogUpdate = emitLogUpdate;
exports.emitCommentUpdate = emitCommentUpdate;
exports.emitCrawlLatestWeather = emitCrawlLatestWeather;
