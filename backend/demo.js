const fetchAirTemp = require("./fetcherUtils/csv/meanAirTemp.js");
const fetchRelHumid = require("./fetcherUtils/csv/meanRelHumid.js");
const fetchWindDirection = require("./fetcherUtils/csv/meanWindDirection.js");
const createLocation = require("./databaseUtils/weatherDatabase/createGeoLocCol.js");
const updateWeather = require("./databaseUtils/weatherDatabase/updateWeatherCol");

createLocation.createLocation();
setInterval(updateWeather.updateWeather, 600000);