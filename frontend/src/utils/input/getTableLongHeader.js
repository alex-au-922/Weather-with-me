import camelToCapitalize from "./camelToCapitalize";

const getTitleHeader = (word) => {
    const mapper = {
      "name": "Name",
      "latitude": "Latitude",
      "longitude": "Longitude",
      "temperature": "Temperature (°C)",
      "relativeHumidity": "Relative Humidity (%)",
      "tenMinMaxGust": "10-min maximum gust (km/h)",
      "tenMinMeanWindSpeed": "10-min mean wind speed (km/h)",
      "tenMinMeanWindDir": "10-min mean wind direction",
      "time": "Time"
    }
    return mapper[word] == null ? camelToCapitalize(word) : mapper[word];
}

export default getTitleHeader;