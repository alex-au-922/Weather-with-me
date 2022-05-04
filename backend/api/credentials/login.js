const express = require("express");
const { UsernameError } = require("../../errorConfig");
const {
  signNewAccessToken,
} = require("../../generalUtils/userCreds/accessToken");
const router = express.Router();
const comparePassword =
  require("../../generalUtils/userCreds/password").comparePassword;
const checkUserCredentials =
  require("../../generalUtils/userCreds/username").checkUserCredentials;
const issueNewRefreshToken =
  require("../../generalUtils/userCreds/refreshToken").issueNewRefreshToken;
const { apiResponseWrapper } = require("../_apiWrapper");

router.post(
  "/",
  apiResponseWrapper(async (req, _) => {
    const { username, password } = req.body;
    const user = await checkUserCredentials("username", username);
    if (user === null) throw new UsernameError("Username does not exist!");
    const passwordCorrect = await comparePassword(password, user.password);
    if (!passwordCorrect) throw new PasswordError("Password incorrect!");
    const newRefreshToken = await issueNewRefreshToken(user._id);
    const newAccessToken = signNewAccessToken(user._id);
    return {
      refreshToken: newRefreshToken,
      accessToken: newAccessToken,
    };
  })
);

module.exports = router;
