const express = require("express");
const router = express.Router();
const findValidRefreshToken =
  require("../../generalUtils/userCreds/refreshToken").findValidRefreshToken;
const refreshTokenRotation =
  require("../../generalUtils/userCreds/refreshToken").refreshTokenRotation;
const signNewAccessToken =
  require("../../generalUtils/userCreds/accessToken").signNewAccessToken;
const { InvalidRefreshTokenError } = require("../../errorConfig");
router.get("/", async (req, res, next) => {
  try {
    const refreshToken = req.headers.authentication;
    const response = res.locals.response;
    const refreshTokenUserId = await findValidRefreshToken(refreshToken);
    if (refreshTokenUserId === null)
      throw new InvalidRefreshTokenError("Refresh token invalid!");
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
    console.log(response);
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
