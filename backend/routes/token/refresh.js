const express = require("express");
const router = express.Router();
const findValidRefreshToken =
  require("../../generalUtils/userCreds/refreshToken").findValidRefreshToken;
const refreshTokenRotation =
  require("../../generalUtils/userCreds/refreshToken").refreshTokenRotation;
const signNewAccessToken =
  require("../../generalUtils/userCreds/accessToken").signNewAccessToken;
const { InvalidRefreshTokenError } = require("../../errorConfig");
const { userWebSocketClients } = require("../../websocket/user");
const { weatherWebSocketClients } = require("../../websocket/weather");

router.get("/", async (req, res, next) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const refreshToken = req.headers.authentication;
    const response = res.locals.response;
    const refreshTokenUserId = await findValidRefreshToken(refreshToken);
    if (refreshTokenUserId === null)
      throw new InvalidRefreshTokenError("Refresh token invalid!");

    if (userWebSocketClients[ip] === undefined)
      userWebSocketClients[ip] = {
        userId: refreshTokenUserId,
        webSocket: null,
      };
    if (weatherWebSocketClients[ip] === undefined)
      weatherWebSocketClients[ip] = {
        userId: refreshTokenUserId,
        webSocket: null,
      };

    const newRefreshToken = await refreshTokenRotation(
      refreshTokenUserId,
      refreshToken
    );
    const newAccessToken = signNewAccessToken(refreshTokenUserId);
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
