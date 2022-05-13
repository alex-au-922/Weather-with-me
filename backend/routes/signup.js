const express = require("express");
const { UsernameError, EmailError } = require("../errorConfig");
const router = express.Router();
const {
  uniqueUsername,
  findUserInfoByEmail,
} = require("../generalUtils/userCreds/username");
const addNewUser =
  require("../databaseUtils/userDatabase/addNewUser").addNewUser;
const passwordHash = require("../generalUtils/userCreds/password").passwordHash;
const issueNewRefreshToken =
  require("../generalUtils/userCreds/refreshToken").issueNewRefreshToken;
const { signNewAccessToken } = require("../generalUtils/userCreds/accessToken");
const { emitUserUpdate } = require("./_emitEvent");
const xss = require("xss");

router.post("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const { username, password, email, viewMode } = req.body;
    const parsedUsername = xss(username);
    const parsedEmail = xss(email);
    const newUsernameUnique = await uniqueUsername(parsedUsername);
    if (!newUsernameUnique) throw new UsernameError("Username already exists!");
    const hashedPassword = await passwordHash(password);
    if (email) {
      const existUser = await findUserInfoByEmail(parsedEmail);
      if (existUser !== null) throw new EmailError("Email already exists!");
    }
    const newUser = {
      username: parsedUsername,
      password: hashedPassword,
      email: parsedEmail || "",
      role: "user",
      viewMode: viewMode || "default",
      favouriteLocataion: [],
    };
    const userId = await addNewUser(newUser);
    const newRefreshToken = await issueNewRefreshToken(userId);
    const newAccessToken = signNewAccessToken(userId);
    response.success = true;
    response.result = {
      refreshToken: newRefreshToken,
      accessToken: newAccessToken,
    };
    res.send(JSON.stringify(response));
    await emitUserUpdate();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
