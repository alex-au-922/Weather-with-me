//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

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
