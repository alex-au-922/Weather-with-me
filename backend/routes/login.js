//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const express = require("express");
const { UsernameError, PasswordError } = require("../errorConfig");
const { signNewAccessToken } = require("../generalUtils/userCreds/accessToken");
const router = express.Router();
const tokenAuthentication = require("./middleware/loginRedirect/tokenAuth");
const comparePassword =
  require("../generalUtils/userCreds/password").comparePassword;
const checkUserCredentials =
  require("../generalUtils/userCreds/username").checkUserCredentials;
const issueNewRefreshToken =
  require("../generalUtils/userCreds/refreshToken").issueNewRefreshToken;
const xss = require("xss");

router.get("/", tokenAuthentication);

router.post("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const { username, password } = req.body;
    const parsedUsername = xss(username);
    const user = await checkUserCredentials("username", parsedUsername);
    if (user === null) throw new UsernameError("Username does not exist!");
    const passwordCorrect = await comparePassword(password, user.password);
    if (!passwordCorrect) throw new PasswordError("Password incorrect!");

    const newRefreshToken = await issueNewRefreshToken(user._id);
    const newAccessToken = signNewAccessToken(user._id);
    response.result = {
      refreshToken: newRefreshToken,
      accessToken: newAccessToken,
    };
    response.success = true;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
