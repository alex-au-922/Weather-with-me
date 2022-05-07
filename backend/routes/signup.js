const express = require("express");
const { UsernameError } = require("../errorConfig");
const router = express.Router();
const uniqueUsername =
  require("../generalUtils/userCreds/username").uniqueUsername;
const addNewUser =
  require("../databaseUtils/userDatabase/addNewUser").addNewUser;
const passwordHash = require("../generalUtils/userCreds/password").passwordHash;
const issueNewRefreshToken =
  require("../generalUtils/userCreds/refreshToken").issueNewRefreshToken;
const eventEmitter = require("./_eventEmitter");

router.post("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
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
    const newRefreshToken = await issueNewRefreshToken(userId);
    const newAccessToken = signNewAccessToken(userId);
    eventEmitter.emit("updateUserData");
    response.success = true;
    response.result = {
      refreshToken: newRefreshToken,
      accessToken: newAccessToken,
    };
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
