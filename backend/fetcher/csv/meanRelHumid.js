const csvToObject = require("../../utils/parseCSVObject.js").csvToObject;
const fetchAPIConfig = require("../../backendConfig.js").fetchAPIConfig;
const parseGovtTimeString =
  require("../../utils/parseGovtTimeString.js").parseGovtTimeString;
const fetch = require("node-fetch");

exports.parsedFetch = async function parsedFetch() {
  const response = await fetch(fetchAPIConfig.meanRelHumid.url);
  const responseText = await response.text();
  const relHumidArray = csvToObject(responseText);
  return cleanRelHumidText(relHumidArray);
};

function cleanRelHumidText(relHumidArray) {
  return relHumidArray.map((oldObject) => {
    const newObject = {};
    newObject["location"] = oldObject["Automatic Weather Station"];
    newObject["relativeHumidity"] = oldObject["Relative Humidity(percent)"];
    newObject["time"] = parseGovtTimeString(oldObject["Date time"]);
    return newObject;
  });
}
