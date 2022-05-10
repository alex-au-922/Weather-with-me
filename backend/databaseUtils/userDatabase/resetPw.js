const logger = require("../../generalUtils/getLogger").getLogger();
const resetPwSchema = require("../../backendConfig.js").databaseConfig
  .resetPwSchema;
const userSchema = require("../../backendConfig").databaseConfig.userSchema;
const { DatabaseError, UnauthorizationError } = require("../../errorConfig");
const { connectUserDB } = require("../../generalUtils/database");

const addPendingResetPwUser = async (resetPwInfo) => {
  try {
    const userDB = await connectUserDB();
    const ResetPwModel = userDB.model("ResetPw", resetPwSchema);
    const existsUserId = await ResetPwModel.findOne({
      userId: resetPwInfo.userId,
    });
    if (existsUserId) {
      const result = await ResetPwModel.updateOne(
        { userId: resetPwInfo.userId },
        resetPwInfo
      );
    } else {
      const result = await ResetPwModel.create(resetPwInfo);
    }
  } catch (error) {
    throw new DatabaseError(error);
  }
};

const deleteResetPasswordRecord = async (username) => {
  const userDB = await connectUserDB();
  const ResetPw = userDB.model("ResetPw", resetPwSchema);
  const result = await ResetPw.deleteOne({ username });
};

const findUserByHash = async (userHash) => {
  try {
    const userDB = await connectUserDB();
    const ResetPwModel = userDB.model("ResetPw", resetPwSchema);
    const resetUserInfo = await ResetPwModel.findOne(
      { userHash },
      "userId expiredTime"
    );
    return resetUserInfo;
  } catch (error) {
    throw new DatabaseError(error);
  }
};

exports.findUserByHash = findUserByHash;
exports.addPendingResetPwUser = addPendingResetPwUser;
exports.deleteResetPasswordRecord = deleteResetPasswordRecord;
