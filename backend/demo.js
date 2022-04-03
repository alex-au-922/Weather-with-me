const fetchAirTemp = require("./fetcherUtils/csv/meanAirTemp.js");
const fetchRelHumid = require("./fetcherUtils/csv/meanRelHumid.js");
const fetchWindDirection = require("./fetcherUtils/csv/meanWindDirection.js");
const createLocation = require("./databaseUtils/createGeoLocCol.js");
const updateWeather = require("./databaseUtils/updateWeatherCol");
const updateTemp = updateWeather.updateTemp;

const result = async function () {
  await createLocation.createLocation();
};

result();
