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
