//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

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
    newObject["updatedTime"] = Date();
    return newObject;
  });
}
