//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

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
