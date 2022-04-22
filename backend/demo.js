const createLocation = require("./databaseUtils/weatherDatabase/createGeoLocCol.js");
const {
  updateTemp,
  updateRelHumid,
  updateWind,
} = require("./databaseUtils/weatherDatabase/updateWeatherCol");
const fetchAPIConfig = require("./backendConfig").fetchAPIConfig;

createLocation.createLocation();

setInterval(updateTemp, fetchAPIConfig.meanAirTemp.fetchDuration);
setInterval(updateRelHumid, fetchAPIConfig.meanRelHumid.fetchDuration);
setInterval(updateWind, fetchAPIConfig.meanWindData.fetchDuration);
