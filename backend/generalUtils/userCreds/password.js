const bcrypt = require("bcrypt");

exports.passwordHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);
  return newPassword;
};

exports.comparePassword = async (typedPassword, hashedPassword) => {
  const isPasswordCorrect = await bcrypt.compare(typedPassword, hashedPassword);
  return isPasswordCorrect;
};
