const csvToObject = require("../../generalUtils/parseCSVObject.js").csvToObject;
const fetchAPIConfig = require("../../backendConfig.js").fetchAPIConfig;
const parseGovtTimeString =
  require("../../generalUtils/parseGovtTimeString.js").parseGovtTimeString;
const fetch = require("node-fetch");

exports.parsedFetch = async function parsedFetch() {
  const response = await fetch(fetchAPIConfig.meanWeatherData.meanRelHumid.url);
  const responseText = await response.text();
  const relHumidArray = csvToObject(responseText);
  return cleanRelHumidText(relHumidArray);
};

function cleanRelHumidText(relHumidArray) {
  return relHumidArray.map((oldObject) => {
    const newObject = {};
    newObject["location"] = oldObject["Automatic Weather Station"];
    newObject["relativeHumidity"] = Number(
      oldObject["Relative Humidity(percent)"]
    );
    if (isNaN(newObject["relativeHumidity"]))
      newObject["relativeHumidity"] = null;
    newObject["time"] = parseGovtTimeString(oldObject["Date time"]);
    return newObject;
  });
}
