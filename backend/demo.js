const createLocation = require("./databaseUtils/weatherDatabase/createGeoLocCol.js");
const {
  updateWeather,
} = require("./databaseUtils/weatherDatabase/updateWeatherCol");
const fetchAPIConfig = require("./backendConfig").fetchAPIConfig;

createLocation.createLocation();

updateWeather();
