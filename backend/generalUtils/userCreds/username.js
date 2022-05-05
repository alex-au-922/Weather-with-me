const { DatabaseError } = require("../../errorConfig");
const { connectUserDB } = require("../database");
const userSchema = require("../../backendConfig.js").databaseConfig.userSchema;
const HTTP_STATUS = require("../../backendConfig").HTTP_STATUS;

const checkUserCredentials = async (key, value) => {
  try {
    const userDB = await connectUserDB();
    const User = userDB.model("User", userSchema);
    const query = { [key]: value };
    const userDoc = await User.findOne(query);
    const user = userDoc === null ? null : userDoc.toObject();
    return user;
  } catch (error) {
    throw new DatabaseError(error);
  }
};

const checkUserCredentialsById = async (userId) => {
  try {
    const userDB = await connectUserDB();
    const UserModel = userDB.model("User", userSchema);
    const foundUser = await UserModel.findById(userId);
    if (foundUser === null) return null;
    const user = foundUser.toObject();
    return user;
  } catch (error) {
    throw new DatabaseError(error);
  }
};

const uniqueUsername = async (username) => {
  const existUser = await checkUserCredentials("username", username);
  return existUser === null;
};

const findUserInfoByEmail = async (email) => {
  const existUser = await checkUserCredentials("email", email);
  if (!existUser) return null;
  const userInfo = {
    userId: existUser.user._id,
    username: existUser.user.username,
  };
  return userInfo;
};

exports.checkUserCredentials = checkUserCredentials;
exports.checkUserCredentialsById = checkUserCredentialsById;

exports.uniqueUsername = uniqueUsername;
exports.findUserInfoByEmail = findUserInfoByEmail;
