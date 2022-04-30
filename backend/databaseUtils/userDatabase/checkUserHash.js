const logger = require("../../generalUtils/getLogger").getLogger();
const resetPwSchema = require("../../backendConfig.js").databaseConfig
  .resetPwSchema;
const userSchema = require("../../backendConfig").databaseConfig.userSchema;
const { connectUserDB } = require("../../generalUtils/database");

const checkUserHash = async (userHash) => {
  const userDB = await connectUserDB();
  try {
    const User = userDB.model("User", userSchema);
    const ResetPw = userDB.model("ResetPw", resetPwSchema);
    const userHashResult = await ResetPw.findOne({ userHash }).populate(
      "userId",
      "username email"
    );
    return userHashResult;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

exports.checkUserHash = checkUserHash;
