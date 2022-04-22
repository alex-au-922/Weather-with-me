const createLocation = require("./databaseUtils/weatherDatabase/createGeoLocCol.js");
const {
  updateWeather,
} = require("./databaseUtils/weatherDatabase/updateWeatherCol");
const fetchAPIConfig = require("./backendConfig").fetchAPIConfig;

createLocation.createLocation();

const init = () => {
  setInterval(updateWeather, fetchAPIConfig.meanWeatherData.fetchDuration);
};

init();
