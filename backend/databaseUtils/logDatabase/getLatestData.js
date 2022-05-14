//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const { DatabaseError } = require("../../errorConfig");
const { connectLoggerDB } = require("../../generalUtils/database");
const requestLogSchema = require("../../backendConfig.js").databaseConfig
  .requestLogSchema;

const getLatestData = async () => {
  try {
    const loggerDB = await connectLoggerDB();
    const requestLog = loggerDB.model("RequestLog", requestLogSchema);
    const result = await requestLog.find();
    return result;
  } catch (error) {
    throw new DatabaseError(error);
  }
};

exports.getLatestData = getLatestData;
