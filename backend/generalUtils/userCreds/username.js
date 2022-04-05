const mongoose = require("mongoose");
const logger = require("../getLogger").getLogger();
const userSchema = require("../../backendConfig.js").databaseConfig.userSchema;

const checkUserCredentials = async (key, value) => {
  try {
    const User = mongoose.model("User", userSchema);
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
  try {
    const User = mongoose.model("User", userSchema);
    const userDoc = await User.findById(_id);
    const user = userDoc.toObject();
    return { success: true, user };
  } catch (error) {
    logger.error(error);
    return { success: false, user: null };
  }
};

const uniqueUsername = async (username) => {
  const existUser = await checkUserCredentials("username", username);
  if (!existUser.success) return null;
  return existUser.user === null;
};

exports.checkUserCredentials = checkUserCredentials;
exports.checkUserCredentialsById = checkUserCredentialsById;

exports.uniqueUsername = uniqueUsername;
