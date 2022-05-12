const getTitleHeader = (word) => {
    const mapper = {
      "name": "Station name",
      "latitude": "Latitude",
      "longitude": "Longitude",
      "temperature": "Temperature (°C)",
      "relativeHumidity": "Relative Humidity (%)",
      "tenMinMaxGust": "10-min maximum gust (m/s)",
      "tenMinMeanWindSpeed": "10-min mean wind direction",
      "tenMinMeanWindDir": "10-min mean wind speed (m/s)",
      "time": "Time"
    }
    return mapper[word];
}

export default getTitleHeader;