const getTitleHeader = (word) => {
    const mapper = {
      "name": "Station name",
      "latitude": "Latitude",
      "longitude": "Longitude",
      "temperature": "Temperature (°C)",
      "relativeHumidity": "Relative Humidity (%)",
      "tenMinMaxGust": "10-min maximum gust (km/h)",
      "tenMinMeanWindSpeed": "10-min mean wind direction",
      "tenMinMeanWindDir": "10-min mean wind speed (km/h)",
      "time": "Time"
    }
    return mapper[word];
}

export default getTitleHeader;