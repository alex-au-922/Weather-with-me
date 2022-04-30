const logger = require("../../generalUtils/getLogger").getLogger();
const resetPwSchema = require("../../backendConfig.js").databaseConfig
  .resetPwSchema;
const { connectUserDB } = require("../../generalUtils/database");

const addPendingResetPwUser = async (resetPwInfo) => {
  const userDB = await connectUserDB();
  try {
    const ResetPw = userDB.model("ResetPw", resetPwSchema);
    const existsUserId = await ResetPw.findOne({ userId: resetPwInfo.userId });
    if (existsUserId) {
      const result = await ResetPw.updateOne(
        { userId: resetPwInfo.userId },
        resetPwInfo
      );
      logger.info(result);
    } else {
      const result = await ResetPw.create(resetPwInfo);
      logger.info(result);
    }
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error };
  }
};

const deleteResetPasswordRecord = async (username) => {
  const userDB = await connectUserDB();
  const ResetPw = userDB.model("ResetPw", resetPwSchema);
  const result = await ResetPw.deleteOne({ username });
};

exports.addPendingResetPwUser = addPendingResetPwUser;
exports.deleteResetPasswordRecord = deleteResetPasswordRecord;
