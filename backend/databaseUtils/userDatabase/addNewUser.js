const logger = require("../../generalUtils/getLogger").getLogger();
const userSchema = require("../../backendConfig.js").databaseConfig.userSchema;
const { connectUserDB } = require("../../generalUtils/database");

const addNewUser = async (newUser) => {
  const userDB = await connectUserDB();
  try {
    const User = userDB.model("User", userSchema);
    const result = await User.create(newUser);
    return result._id;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

exports.addNewUser = addNewUser;
