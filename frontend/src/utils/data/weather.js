import parseCommentDataFrontendView from "./comments";
import sortOnKey from "../sortOnKey.js";

const parseWeatherDataFrontendView = (weatherJson, parsedCommentObj) => {
  const weatherList = weatherJson.map((obj) => {
    const newWeatherObject = {};
    newWeatherObject["name"] = obj.locationId.name;
    newWeatherObject["latitude"] = obj.locationId.latitude;
    newWeatherObject["longitude"] = obj.locationId.longitude;
    newWeatherObject["time"] = obj.time;
    newWeatherObject["temperature"] = obj.temperature ?? null;
    newWeatherObject["tenMinMaxGust"] = obj.tenMinMaxGust ?? null;
    newWeatherObject["tenMinMeanWindDir"] = obj.tenMinMeanWindDir ?? null;
    newWeatherObject["tenMinMeanWindSpeed"] = obj.tenMinMeanWindSpeed ?? null;
    newWeatherObject["relativeHumidity"] = obj.relativeHumidity ?? null;
    if (parsedCommentObj[obj.locationId.name] !== undefined) {
      newWeatherObject["comments"] = sortOnKey(parsedCommentObj[obj.locationId.name], "createTime");
    } else {
      newWeatherObject["comments"] = [];
    }

    return newWeatherObject;
  });
  return weatherList;
};

export default parseWeatherDataFrontendView;
