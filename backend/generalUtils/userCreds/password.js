const bcrypt = require("bcrypt");
const logger = require("../getLogger").getLogger();
const { connectUserDB } = require("../database");
const userSchema = require("../../backendConfig.js").databaseConfig.userSchema;

exports.passwordHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);
  return newPassword;
};

exports.comparePassword = async (typedPassword, hashedPassword) => {
  const isPasswordCorrect = await bcrypt.compare(typedPassword, hashedPassword);
  return isPasswordCorrect;
};

exports.updatePassword = async (userInfo) => {
  const { username, password } = userInfo;
  const userDB = await connectUserDB();
  try {
    const User = userDB.model("User", userSchema);
    await User.updateOne({ username }, { password });
    return { success: true, errorType: null, error: null };
  } catch (error) {
    logger.error(error);
    return { success: false, errorType: "unknown", error };
  }
};
