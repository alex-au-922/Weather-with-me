const loggerConfig = require("../backendConfig.js").loggerConfig;
const loggerSchema = require("../backendConfig.js").databaseConfig.loggerSchema;
const { connectLoggerDB } = require("./database");

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

function _getCallerFile() {
  const originalFunc = Error.prepareStackTrace;

  let callerfile;
  try {
    const err = new Error();
    let currentfile;

    Error.prepareStackTrace = function (err, stack) {
      return stack;
    };

    currentfile = err.stack.shift().getFileName();

    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName();

      if (currentfile !== callerfile) break;
    }
  } catch (e) {}

  Error.prepareStackTrace = originalFunc;
  return callerfile;
}

class LoggerDBClass {
  constructor(logger) {
    this.logger = logger;
  }
  info = function (message, ip = "system", errorType = null) {
    this.insertToDB(
      Date(Date.now()),
      _getCallerFile(),
      ip,
      "info",
      message,
      errorType
    );
    return this.logger.info(message);
  };
  error = function (message, ip = "system", errorType = null) {
    this.insertToDB(
      Date(Date.now()),
      _getCallerFile(),
      ip,
      "error",
      message,
      errorType
    );
    return this.logger.error(message);
  };

  insertToDB = async function (
    loggerTime,
    loggerFileName,
    loggerIp,
    loggerLevel,
    loggerMessage,
    loggerErrorType
  ) {
    const loggerInfo = {
      time: loggerTime,
      filename: loggerFileName,
      ip: loggerIp,
      level: loggerLevel,
      message: loggerMessage,
      errorType: loggerErrorType,
    };
    const loggerDB = await connectLoggerDB();
    const newLogger = loggerDB.model("Logger", loggerSchema);
    await newLogger.create(loggerInfo);
  };
}

exports.getLogger = function () {
  LoggerWithInsertingDB = new LoggerDBClass(
    winston.createLogger(logConfiguration)
  );
  //LoggerWithInsertingDB.insertToDB();
  return LoggerWithInsertingDB;
};
