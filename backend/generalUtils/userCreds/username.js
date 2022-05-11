const { DatabaseError } = require("../../errorConfig");
const { connectUserDB, connectWeatherDB } = require("../database");
const { userSchema, geolocationSchema } =
  require("../../backendConfig.js").databaseConfig;

const checkUserCredentials = async (key, value) => {
  try {
    const userDB = await connectUserDB();
    const User = userDB.model("User", userSchema);
    const weatherDB = await connectWeatherDB();
    const GeoLocation = weatherDB.model("GeoLocation", geolocationSchema);
    const query = { [key]: value };
    const userDoc = await User.findOne(query).populate({
      path: "favouriteLocation",
      model: GeoLocation,
      options: { strictPopulate: false },
    });
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
    const weatherDB = await connectWeatherDB();
    const GeoLocation = weatherDB.model("GeoLocation", geolocationSchema);
    const foundUser = await UserModel.findById(userId).populate(
      "favouriteLocation",
      "",
      GeoLocation
    );
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
