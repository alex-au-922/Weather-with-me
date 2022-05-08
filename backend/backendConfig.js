const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

exports.fetchAPIConfig = {
  meanWeatherData: {
    meanAirTemp: {
      url: "https://data.weather.gov.hk/weatherAPI/hko_data/regional-weather/latest_1min_temperature.csv",
    },
    meanRelHumid: {
      url: "https://data.weather.gov.hk/weatherAPI/hko_data/regional-weather/latest_1min_humidity.csv",
    },
    meanWindData: {
      url: "https://data.weather.gov.hk/weatherAPI/hko_data/regional-weather/latest_10min_wind.csv",
    },
    fetchDuration: 60000, // 1 minute
  },
  pollutantAirQuality: {
    pollutant: {
      url: "https://www.aqhi.gov.hk/epd/ddata/html/out/24pc_Eng.xml",
    },
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
  geolocationSchema: new mongoose.Schema(
    {
      name: String,
      address: String,
      latitude: Number,
      longitude: Number,
      tempStation: String,
      relHumStation: String,
      windStation: String,
    },
    {
      toJSON: {
        transform: function (doc, ret) {
          delete ret._id;
          delete ret.__v;
        },
      },
    }
  ),
  weatherSchema: new mongoose.Schema(
    {
      time: Date,
      locationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GeoLocation",
        unique: true,
      },
      temperature: Number,
      relativeHumidity: { type: Number, min: 0, max: 100 },
      tenMinMeanWindDir: String,
      tenMinMeanWindSpeed: Number,
      tenMinMaxGust: Number,
      updatedTime: Date,
    },
    {
      toJSON: {
        transform: function (doc, ret) {
          delete ret._id;
          delete ret.__v;
        },
      },
    }
  ),
  backupWeatherSchema: new mongoose.Schema(
    {
      time: Date,
      locationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GeoLocation",
        unique: true,
      },
      temperature: Number,
      relativeHumidity: { type: Number, min: 0, max: 100 },
      tenMinMeanWindDir: String,
      tenMinMeanWindSpeed: Number,
      tenMinMaxGust: Number,
      updatedTime: Date,
    },
    {
      toJSON: {
        transform: function (doc, ret) {
          delete ret._id;
          delete ret.__v;
        },
      },
    }
  ),
  userSchema: new mongoose.Schema(
    {
      username: String,
      password: String,
      email: String,
      viewMode: String,
      role: String,
    },
    {
      toJSON: {
        transform: function (doc, ret) {
          delete ret._id;
          delete ret.__v;
        },
      },
    }
  ),
  resetPwSchema: new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
      },
      userHash: String,
      createdTime: Date,
      expiredTime: Date,
    },
    {
      toJSON: {
        transform: function (doc, ret) {
          delete ret._id;
          delete ret.__v;
        },
      },
    }
  ),
  refreshTokenSchema: new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
      },
      refreshTokenHash: String,
      createdTime: Date,
      expiredTime: Date,
    },
    {
      toJSON: {
        transform: function (doc, ret) {
          delete ret._id;
          delete ret.__v;
        },
      },
    }
  ),
};

exports.resetLinkExpiredTime = 3600000; //1 hour

exports.transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_EMAIL_PW,
  },
});

exports.HTTP_STATUS = {
  success: {
    ok: {
      status: 200,
      statusType: "SUCCESS",
    },
    created: {
      status: 201,
      statusType: "RESOURCE_CREATED",
    },
    accepted: {
      status: 202,
      statusType: "METHOD_ACCEPTED",
    },
    noContent: {
      status: 204,
      statusType: "SUCCESS_NO_CONTENT",
    },
  },
  clientError: {
    badRequest: {
      status: 400,
      statusType: "BAD_REQUEST_ERROR",
    },
    unauthorized: {
      status: 401,
      statusType: "UNAUTHORIZED_ERROR",
    },
    forbidden: {
      status: 403,
      statusType: "FORBIDDEN_ERROR",
    },
    notFound: {
      status: 404,
      statusType: "NOT_FOUND_ERROR",
    },
    methodNotAllowed: {
      status: 405,
      statusType: "METHOD_NOT_ALLOWED_ERROR",
    },
    notAccepted: {
      status: 406,
      statusType: "NOT_ACCETPED_ERROR",
    },
    requestTimeout: {
      status: 408,
      statusType: "REQUEST_TIMEOUT_ERROR",
    },
  },
  serverError: {
    internalServerError: {
      status: 500,
      statusType: "INTERNAL_SERVER_ERROR",
    },
    notImplemented: {
      status: 501,
      statusType: "NOT_IMPLEMENTED_ERROR",
    },
    badGateWay: {
      status: 502,
      statusType: "BAD_GATEWAY_ERROR",
    },
    serviceUnavailable: {
      status: 503,
      statusType: "SERVICE_UNAVAILBLE_ERROR",
    },
  },
};

exports.ACCESS_TOKEN_EXPIRED_TIME = "15m";
