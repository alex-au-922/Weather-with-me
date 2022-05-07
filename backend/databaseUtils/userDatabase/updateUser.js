const { DatabaseError } = require("../../errorConfig");
const userSchema = require("../../backendConfig.js").databaseConfig.userSchema;
const { connectUserDB } = require("../../generalUtils/database");

const updateUser = async (userId, updatedUserInfo) => {
  const userDB = await connectUserDB();
  const UserModel = userDB.model("User", userSchema);
  const existsUser = await UserModel.findOne({ userId });
  if (existsUser === null) throw new DatabaseError("No user record!");
  await UserModel.updateOne({ userId }, updatedUserInfo);
  return true;
};

exports.updateUser = updateUser;
