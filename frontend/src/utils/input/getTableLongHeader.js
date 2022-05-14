//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

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