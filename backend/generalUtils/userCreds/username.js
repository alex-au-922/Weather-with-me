const { connectUserDB } = require("../database");
const logger = require("../getLogger").getLogger();
const userSchema = require("../../backendConfig.js").databaseConfig.userSchema;
const HTTP_STATUS = require("../../backendConfig").HTTP_STATUS;

const checkUserCredentials = async (key, value) => {
  const userDB = await connectUserDB();
  try {
    const User = userDB.model("User", userSchema);
    const query = { [key]: value };
    const userDoc = await User.findOne(query);
    const user = userDoc === null ? null : userDoc.toObject();
    return { success: true, user };
  } catch (error) {
    logger.error(error);
    return { success: false, user: null };
  }
};

const checkUserCredentialsById = async (userId) => {
  const response = {
    success: false,
    error: null,
    errorType: null,
    user: null,
  };
  const userDB = await connectUserDB();
  try {
    const UserModel = userDB.model("User", userSchema);
    const foundUser = await UserModel.findById(userId);
    if (foundUser === null) {
      response.error = "unauthorized_action";
      response.errorType = HTTP_STATUS.clientError.unauthorized.statusType;
      return response;
    }
    const user = foundUser.toObject();
    response.success = true;
    response.user = user;
    return response;
  } catch (error) {
    logger.error(error);
    response.error = error;
    response.errorType = "UNKNOWN_ERROR";
    return { success: false, user: null };
  }
};

const uniqueUsername = async (username) => {
  const existUser = await checkUserCredentials("username", username);
  if (!existUser.success) return null;
  return existUser.user === null;
};

const findUserInfoByEmail = async (email) => {
  const existUser = await checkUserCredentials("email", email);
  if (existUser.success && existUser.user !== null) {
    const userInfo = {
      userId: existUser.user._id,
      username: existUser.user.username,
    };
    return userInfo;
  } else {
    return null;
  }
};

exports.checkUserCredentials = checkUserCredentials;
exports.checkUserCredentialsById = checkUserCredentialsById;

exports.uniqueUsername = uniqueUsername;
exports.findUserInfoByEmail = findUserInfoByEmail;
