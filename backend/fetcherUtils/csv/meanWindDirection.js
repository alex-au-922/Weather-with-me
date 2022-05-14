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
  const response = await fetch(fetchAPIConfig.meanWeatherData.meanWindData.url);
  const responseText = await response.text();
  const windDirectionArray = csvToObject(responseText);
  return cleanWindDirectionText(windDirectionArray);
};

function cleanWindDirectionText(windDirectionArray) {
  return windDirectionArray.map((oldObject) => {
    const newObject = {};
    newObject["location"] = oldObject["Automatic Weather Station"];
    newObject["tenMinMeanWindDir"] =
      oldObject["10-Minute Mean Wind Direction(Compass points)"];
    if (newObject["tenMinMeanWindDir"] === "N/A")
      newObject["tenMinMeanWindDir"] = null;
    newObject["tenMinMeanWindSpeed"] = Number(
      oldObject["10-Minute Mean Speed(km/hour)"]
    );
    if (isNaN(newObject["tenMinMeanWindSpeed"]))
      newObject["tenMinMeanWindSpeed"] = null;
    newObject["tenMinMaxGust"] = Number(
      oldObject["10-Minute Maximum Gust(km/hour)"]
    );
    if (isNaN(newObject["tenMinMaxGust"])) newObject["tenMinMaxGust"] = null;
    newObject["time"] = parseGovtTimeString(oldObject["Date time"]);
    newObject["updatedTime"] = Date();
    return newObject;
  });
}
