const express = require("express");
const { UsernameError } = require("../../errorConfig");
const router = express.Router();
const uniqueUsername =
  require("../../generalUtils/userCreds/username").uniqueUsername;
const addNewUser =
  require("../../databaseUtils/userDatabase/addNewUser").addNewUser;
const passwordHash =
  require("../../generalUtils/userCreds/password").passwordHash;
const encrypt = require("../../generalUtils/jwt/encrypt").encrypt;
const { apiResponseWrapper } = require("../_apiWrapper");
const eventEmitter = require("../_eventEmitter");

router.post(
  "/",
  apiResponseWrapper(async (req, _) => {
    const { username, password, email } = req.body;
    const newUsernameUnique = await uniqueUsername(username);
    if (!newUsernameUnique) throw new UsernameError("Username already exists");
    const hashedPassword = await passwordHash(password);
    const newUser = {
      username: username,
      password: hashedPassword,
      email: email,
      role: "user",
      viewMode: "default",
    };
    const userId = await addNewUser(newUser);
    const refreshToken = encrypt(userId);
    eventEmitter.emit("updateUserData");
    return refreshToken;
  })
);

module.exports = router;
