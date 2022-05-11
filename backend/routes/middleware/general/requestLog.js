const requestLogSchema = require("../../../backendConfig.js").databaseConfig
  .requestLogSchema;
const { connectLoggerDB } = require("../../../generalUtils/database");

const insertRequestLogToDB = async function (req, res, next) {
  try {
    const requestLogInfo = {
      method: req.method,
      userAgent: req.headers["user-agent"],
      date: Date(Date.now()),
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
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
