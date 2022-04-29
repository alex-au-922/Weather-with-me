const logger = require("../../generalUtils/getLogger").getLogger();
const resetPwSchema = require("../../backendConfig.js").databaseConfig
  .resetPwSchema;
const { connectUserDB } = require("../../generalUtils/database");

const checkUserHash = async (userHash) => {
  const userDB = await connectUserDB();
  try {
    const ResetPw = userDB.model("ResetPw", resetPwSchema);
    const userHashResult = await ResetPw.findOne({ userHash });
    return userHashResult;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

exports.checkUserHash = checkUserHash;
