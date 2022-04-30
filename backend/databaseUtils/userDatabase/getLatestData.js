const { connectUserDB } = require("../../generalUtils/database");
const logger = require("../../generalUtils/getLogger").getLogger();
const userSchema = require("../../backendConfig.js").databaseConfig.userSchema;

const getLatestData = async () => {
  const userDB = await connectUserDB();
  try {
    const User = userDB.model("User", userSchema);
    const result = await User.find();
    return { success: true, result, error: null };
  } catch (error) {
    logger.error(error);
    return { success: false, result: null, error };
  }
};

exports.getLatestData = getLatestData;
