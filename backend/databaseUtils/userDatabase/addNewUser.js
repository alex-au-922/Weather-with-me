//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const { DatabaseError } = require("../../errorConfig");
const userSchema = require("../../backendConfig.js").databaseConfig.userSchema;
const { connectUserDB } = require("../../generalUtils/database");

const addNewUser = async (newUser) => {
  try {
    const userDB = await connectUserDB();
    const UserModel = userDB.model("User", userSchema);
    const result = await UserModel.create(newUser);
    return result._id;
  } catch (error) {
    throw new DatabaseError("Cannot create new user to database!");
  }
};

exports.addNewUser = addNewUser;
