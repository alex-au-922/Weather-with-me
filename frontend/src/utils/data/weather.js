import sortOnKey from "../sortOnKey";
const parseWeatherDataFrontendView = (weatherJson) => {
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
    return newWeatherObject;
  });
  const newWeatherList = sortOnKey(weatherList, "name", true);
  return newWeatherList;
};

export default parseWeatherDataFrontendView;
