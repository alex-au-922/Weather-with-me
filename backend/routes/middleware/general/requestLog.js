//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const requestLogSchema = require("../../../backendConfig.js").databaseConfig
  .requestLogSchema;
const { connectLoggerDB } = require("../../../generalUtils/database");
const { emitLogUpdate } = require("../../_emitEvent.js");

const insertRequestLogToDB = async function (req, res, next) {
  try {
    const requestLogInfo = {
      method: req.method,
      userAgent: req.headers["user-agent"],
      date: Date(Date.now()),
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      api: req.baseUrl + req.path,
    };
    const loggerDB = await connectLoggerDB();
    const newRequestLog = loggerDB.model("RequestLog", requestLogSchema);
    const result = await newRequestLog.create(requestLogInfo);
    await emitLogUpdate();
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = insertRequestLogToDB;
