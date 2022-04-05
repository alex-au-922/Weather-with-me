const mongoose = require("mongoose");
const databaseUtils = require("../../generalUtils/database");
const logger = require("../../generalUtils/getLogger").getLogger();
const userSchema = require("../../backendConfig.js").databaseConfig.userSchema;

const addNewUser = async (newUser) => {
  try {
    const User = mongoose.model("User", userSchema);
    const result = await User.create(newUser);
    return result._id;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

exports.addNewUser = addNewUser;
