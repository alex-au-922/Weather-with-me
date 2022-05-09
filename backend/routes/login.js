const express = require("express");
const { UsernameError, PasswordError } = require("../errorConfig");
const { signNewAccessToken } = require("../generalUtils/userCreds/accessToken");
const { userWebSocketClients } = require("../websocket/user");
const router = express.Router();
const tokenAuthentication = require("./middleware/loginRedirect/tokenAuth");
const comparePassword =
  require("../generalUtils/userCreds/password").comparePassword;
const checkUserCredentials =
  require("../generalUtils/userCreds/username").checkUserCredentials;
const issueNewRefreshToken =
  require("../generalUtils/userCreds/refreshToken").issueNewRefreshToken;
const { weatherWebSocketClients } = require("../websocket/weather");

router.get("/", tokenAuthentication);

router.post("/", async (req, res, next) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const response = res.locals.response;
    const { username, password } = req.body;
    const user = await checkUserCredentials("username", username);
    if (user === null) throw new UsernameError("Username does not exist!");
    const passwordCorrect = await comparePassword(password, user.password);
    if (!passwordCorrect) throw new PasswordError("Password incorrect!");

    if (userWebSocketClients[ip] === undefined)
      userWebSocketClients[ip] = {
        userId: user._id,
        webSocket: null,
      };
    if (weatherWebSocketClients[ip] === undefined)
      weatherWebSocketClients[ip] = {
        userId: user._id,
        webSocket: null,
      };

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
