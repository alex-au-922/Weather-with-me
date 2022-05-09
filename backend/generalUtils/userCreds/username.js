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

const cleanUserData = (user) => {
  const newUser = { ...user };
  delete newUser._id;
  delete newUser.password;
  delete newUser.__v;
  return newUser;
};

const uniqueUsername = async (username) => {
  const existUser = await findUserInfoByUsername(username);
  return existUser === null;
};

const findUserInfoByEmail = async (email) => {
  const existUser = await checkUserCredentials("email", email);
  console.log("existUser", existUser);
  if (!existUser) return null;
  const userInfo = {
    userId: existUser._id,
    username: existUser.username,
  };
  return userInfo;
};

const findUserInfoByUsername = async (username) => {
  const existUser = await checkUserCredentials("username", username);
  if (!existUser) return null;
  const userInfo = {
    userId: existUser._id,
    username: existUser.username,
  };
  return userInfo;
};

exports.checkUserCredentials = checkUserCredentials;
exports.checkUserCredentialsById = checkUserCredentialsById;
exports.cleanUserData = cleanUserData;
exports.uniqueUsername = uniqueUsername;
exports.findUserInfoByEmail = findUserInfoByEmail;
exports.findUserInfoByUsername = findUserInfoByUsername;
