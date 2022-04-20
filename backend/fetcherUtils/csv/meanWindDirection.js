const csvToObject = require("../../generalUtils/parseCSVObject.js").csvToObject;
const fetchAPIConfig = require("../../backendConfig.js").fetchAPIConfig;
const parseGovtTimeString =
  require("../../generalUtils/parseGovtTimeString.js").parseGovtTimeString;
const fetch = require("node-fetch");

exports.parsedFetch = async function parsedFetch() {
  const response = await fetch(fetchAPIConfig.meanWindData.url);
  const responseText = await response.text();
  const windDirectionArray = csvToObject(responseText);
  console.log(parseGovtTimeString);
  return cleanWindDirectionText(windDirectionArray);
};

function cleanWindDirectionText(windDirectionArray) {
  return windDirectionArray.map((oldObject) => {
    const newObject = {};
    newObject["location"] = oldObject["Automatic Weather Station"];
    newObject["tenMinMeanWindDir"] =
      oldObject["10-Minute Mean Wind Direction(Compass points)"];
    if (newObject["tenMinMeanWindDir"] === "N/A") newObject["tenMinMeanWindDir"] = null;
    newObject["tenMinMeanWindSpeed"] = Number(
      oldObject["10-Minute Mean Speed(km/hour)"]
    );
    if (isNaN(newObject["tenMinMeanWindSpeed"])) newObject["tenMinMeanWindSpeed"] = null;
    newObject["tenMinMaxGust"] = Number(
      oldObject["10-Minute Maximum Gust(km/hour)"]
    );
    if (isNaN(newObject["tenMinMaxGust"])) newObject["tenMinMaxGust"] = null;
    newObject["time"] = parseGovtTimeString(oldObject["Date time"]);
    return newObject;
  });
}
