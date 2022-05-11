const { DatabaseError } = require("../../errorConfig");
const { connectLoggerDB } = require("../../generalUtils/database");
const requestLogSchema = require("../../backendConfig.js").databaseConfig
  .requestLogSchema;

const getLatestLogData = async () => {
  try {
    const loggerDB = await connectLoggerDB();
    const requestLog = loggerDB.model("RequestLog", requestLogSchema);
    const result = await requestLog.find();
    return result;
  } catch (error) {
    throw new DatabaseError(error);
  }
};

exports.getLatestLogData = getLatestLogData;
