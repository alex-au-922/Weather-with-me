const mongoose = require("mongoose");

exports.fetchAPIConfig = {
  meanAirTemp: {
    url: "https://data.weather.gov.hk/weatherAPI/hko_data/regional-weather/latest_1min_temperature.csv",
    fetchDuration: 600000, // 10 minutes
  },
  meanRelHumid: {
    url: "https://data.weather.gov.hk/weatherAPI/hko_data/regional-weather/latest_1min_humidity.csv",
    fetchDuration: 600000, // 10 minutes
  },
  meanWindDirection: {
    url: "https://data.weather.gov.hk/weatherAPI/hko_data/regional-weather/latest_10min_wind.csv",
    fetchDuration: 600000, // 10 minutes
  },
  pollutantAirQuality: {
    url: "https://www.aqhi.gov.hk/epd/ddata/html/out/24pc_Eng.xml",
    fetchDuration: 3600000, // 1 hour
  },
};

exports.loggerConfig = {
  logFormat: {
    logTimeFormat: "YYYY-MM-DD HH:mm:ss",
    logMessageFormat: (info) =>
      `${[info.timestamp]} [${info.level}] > ${info.message}`,
  },
  logFileFormat: {
    debugLogFileName: `${__dirname}/logs/debug_%DATE%.log`,
    warnLogFileName: `${__dirname}/logs/warning_%DATE%.log`,
    logFileNameDatePattern: "YYYY-MM-DD",
    archieveLogFile: false,
    maxSize: "500m",
    maxFiles: "7d",
  },
};

exports.databaseConfig = {
  geolocationSchema: new mongoose.Schema({
    name: String,
    latitude: Number,
    longitude: Number,
  }),
  weatherSchema: new mongoose.Schema({
    time: Date,
    locationId: [{ type: mongoose.Schema.Types.ObjectId, ref: "geolocations" }],
    temperature: Number,
    relativeHumidity: { type: Number, min: 0, max: 100 },
    tenMinMeanWindDir: String,
    tenMinMeanWindSpeed: Number,
    tenMinMaxGust: Number,
  }),
  userSchema: new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    viewMode: String,
    role: String,
  }),
};

