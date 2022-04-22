const csvToObject = require("../../generalUtils/parseCSVObject.js").csvToObject;
const fetchAPIConfig = require("../../backendConfig.js").fetchAPIConfig;
const parseGovtTimeString =
  require("../../generalUtils/parseGovtTimeString.js").parseGovtTimeString;
const fetch = require("node-fetch");

exports.parsedFetch = async function parsedFetch() {
  const response = await fetch(fetchAPIConfig.meanWeatherData.meanAirTemp.url);
  const responseText = await response.text();
  const airTempArray = csvToObject(responseText);
  return cleanAirTempText(airTempArray);
};

function cleanAirTempText(airTempArray) {
  return airTempArray.map((oldObject) => {
    const newObject = {};
    newObject["location"] = oldObject["Automatic Weather Station"];
    newObject["temperature"] = Number(
      oldObject["Air Temperature(degree Celsius)"]
    );
    if (isNaN(newObject["temperature"])) newObject["temperature"] = null;
    newObject["time"] = parseGovtTimeString(oldObject["Date time"]);
    return newObject;
  });
}
