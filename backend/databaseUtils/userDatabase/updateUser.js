const { DatabaseError } = require("../../errorConfig");
const userSchema = require("../../backendConfig.js").databaseConfig.userSchema;
const { ObjectId } = require("mongoose").Types;
const { connectUserDB } = require("../../generalUtils/database");

const updateUser = async (userId, updatedUserInfo) => {
  const userDB = await connectUserDB();
  const UserModel = userDB.model("User", userSchema);
  const existsUser = await UserModel.findById(userId);
  if (existsUser === null) throw new DatabaseError("No user record!");
  await UserModel.updateOne({ _id: ObjectId(userId) }, updatedUserInfo);
  return true;
};

exports.updateUser = updateUser;
