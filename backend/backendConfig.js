exports.fetchAPIConfig = {
  meanAirTemp: {
    url: "https://data.weather.gov.hk/weatherAPI/hko_data/regional-weather/latest_1min_temperature.csv",
    fetchDuration: 60000,
  },
  meanRelHumid: {
    url: "https://data.weather.gov.hk/weatherAPI/hko_data/regional-weather/latest_1min_humidity.csv",
    fetchDuration: 60000,
  },
  meanWindDirection: {
    url: "https://data.weather.gov.hk/weatherAPI/hko_data/regional-weather/latest_10min_wind.csv",
    fetchDuration: 600000,
  },
  pollutantAirQuality: {
    url: "https://www.aqhi.gov.hk/epd/ddata/html/out/24pc_Eng.xml",
    fetchDuration: 600000,
  },
};

exports.loggerConfig = {
  logFormat: {
    logTimeFormat: "YYYY-MM-DD HH:mm:ss",
    logMessageFormat: (info) =>
      `${[info.timestamp]} [${info.level}] > ${info.message}`,
  },
  logFileFormat: {
    debugLogFileName: "logs/debug_%DATE%.log",
    warnLogFileName: "logs/warning_%DATE%.log",
    logFileNameDatePattern: "YYYY-MM-DD",
    archieveLogFile: false,
    maxSize: "500m",
    maxFiles: "7d",
  },
};
