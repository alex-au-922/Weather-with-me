const { connectUserDB } = require("../../generalUtils/database");
const logger = require("../../generalUtils/getLogger").getLogger();
const userSchema = require("../../backendConfig.js").databaseConfig.userSchema;

const getLatestData = async () => {
  const userDB = await connectUserDB();
  const response = {
    success: false,
    error: null,
    errorType: null,
    result: null,
  };
  try {
    const User = userDB.model("User", userSchema);
    const result = await User.find();
    response.success = true;
    response.result = result;
  } catch (error) {
    logger.error(error);
    response.error = error;
    response.errorType = "UNKNOWN_ERROR";
  }
  return response;
};

exports.getLatestData = getLatestData;
