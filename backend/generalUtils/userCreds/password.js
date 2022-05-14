const bcrypt = require("bcrypt");
const { PasswordError } = require("../../errorConfig");

const passwordHash = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);
    return newPassword;
  } catch (error) {
    throw new PasswordError("Invalid password format!");
  }
};

const comparePassword = async (typedPassword, hashedPassword) => {
  try {
    const passwordCorrect = await bcrypt.compare(typedPassword, hashedPassword);
    return passwordCorrect;
  } catch (error) {
    throw new PasswordError("Invalid password format!");
  }
};

exports.comparePassword = comparePassword;
exports.passwordHash = passwordHash;
