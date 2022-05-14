const { DatabaseError } = require("../../errorConfig");
const userSchema = require("../../backendConfig.js").databaseConfig.userSchema;
const { ObjectId } = require("mongoose").Types;
const { connectUserDB } = require("../../generalUtils/database");

const deleteUser = async (userId) => {
  const userDB = await connectUserDB();
  const UserModel = userDB.model("User", userSchema);
  const existsUser = await UserModel.findById(userId);
  if (existsUser === null) throw new DatabaseError("No user record!");
  await UserModel.deleteOne({ _id: ObjectId(userId) });
  return true;
};

exports.deleteUser = deleteUser;
