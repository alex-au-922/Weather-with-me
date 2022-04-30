const { connectUserDB } = require("../database");
const logger = require("../getLogger").getLogger();
const userSchema = require("../../backendConfig.js").databaseConfig.userSchema;

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

const checkUserCredentialsById = async (_id) => {
  const userDB = await connectUserDB();
  try {
    const User = userDB.model("User", userSchema);
    const userDoc = await User.findById(_id);
    const user = userDoc.toObject();
    return { success: true, user };
  } catch (error) {
    console.log(error);
    logger.error(error);
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
