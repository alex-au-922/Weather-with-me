const loggerConfig = require("../backendConfig.js").loggerConfig;

const winston = require("winston");
require("winston-daily-rotate-file");

const myFormat = winston.format.combine(
  winston.format.timestamp({
    format: loggerConfig.logFormat.logTimeFormat,
  }),
  winston.format.align(),
  winston.format.printf(loggerConfig.logFormat.logMessageFormat)
);

const debugRotationFileFormat = new winston.transports.DailyRotateFile({
  filename: loggerConfig.logFileFormat.debugLogFileName,
  datePattern: loggerConfig.logFileFormat.logFileNameDatePattern,
  zippedArchive: loggerConfig.logFileFormat.archieveLogFile,
  maxSize: loggerConfig.logFileFormat.maxSize,
  maxFiles: loggerConfig.logFileFormat.maxFiles,
  level: "debug",
  format: myFormat,
});

const warnRotationFileFormat = new winston.transports.DailyRotateFile({
  filename: loggerConfig.logFileFormat.warnLogFileName,
  datePattern: loggerConfig.logFileFormat.logFileNameDatePattern,
  zippedArchive: loggerConfig.logFileFormat.archieveLogFile,
  maxSize: loggerConfig.logFileFormat.maxSize,
  maxFiles: loggerConfig.logFileFormat.maxFiles,
  level: "warn",
  format: myFormat,
});

const logConfiguration = {
  transports: [
    debugRotationFileFormat,
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(winston.format.colorize(), myFormat),
    }),
    warnRotationFileFormat,
  ],
};

exports.getLogger = function () {
  return winston.createLogger(logConfiguration);
};
