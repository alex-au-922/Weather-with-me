const { DatabaseError } = require("../../errorConfig");
const { connectUserDB } = require("../../generalUtils/database");
const logger = require("../../generalUtils/getLogger").getLogger();
const userSchema = require("../../backendConfig.js").databaseConfig.userSchema;

const getLatestData = async () => {
  try {
    const userDB = await connectUserDB();
    const User = userDB.model("User", userSchema);
    const result = await User.find();
    return result;
  } catch (error) {
    throw new DatabaseError(error);
  }
};

exports.getLatestData = getLatestData;
