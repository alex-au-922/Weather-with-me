const csvToObject = require("../../utils/parseCSVObject.js").csvToObject;
const fetchAPIConfig = require("../../backendConfig.js").fetchAPIConfig;
const parseGovtTimeString =
  require("../../utils/parseGovtTimeString.js").parseGovtTimeString;
const fetch = require("node-fetch");

exports.parsedFetch = async function parsedFetch() {
  const response = await fetch(fetchAPIConfig.meanWindDirection.url);
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
    newObject["tenMinMeanSpeed"] = Number(
      oldObject["10-Minute Mean Speed(km/hour)"]
    );
    newObject["tenMinMaxGust"] = Number(
      oldObject["10-Minute Maximum Gust(km/hour)"]
    );
    newObject["time"] = parseGovtTimeString(oldObject["Date time"]);
    return newObject;
  });
}
