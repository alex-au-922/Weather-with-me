const requestLogSchema = require("../../../backendConfig.js").databaseConfig
  .requestLogSchema;

const insertRequestLogToDB = async function (req, res, next) {
  try {
    const requestLogInfo = {
      method: req.method,
      userAgent: req.headers["user-agent"],
      date: Date(Date.now()).toString,
      ip: requestLogIp,
    };
    const loggerDB = await connectLoggerDB();
    const newRequestLog = loggerDB.model("RequestLog", requestLogSchema);
    const result = await newRequestLog.create(requestLogInfo);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = insertRequestLogToDB;
