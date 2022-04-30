const { connectUserDB } = require("../../generalUtils/database");
const userSchema = require("../../backendConfig.js").databaseConfig.userSchema;
const logger = require("../../generalUtils/getLogger").getLogger();

const updateUserData = async (username, key, value) => {
  const userDB = await connectUserDB();
  try {
    const User = userDB.model("User", userSchema);
    const query = { [key]: value };
    const result = await User.updateOne({ username }, query);
    logger.info(result);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error };
  }
};

exports.updateUserData = updateUserData;
