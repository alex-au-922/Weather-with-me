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
    console.log('refreshToken: ' + refreshToken);
    const refreshTokenUserId = await findValidRefreshToken(refreshToken);
    console.log(refreshTokenUserId);
    if (refreshTokenUserId === null)
      throw new InvalidRefreshTokenError("Refresh token invalid!");
    // const newRefreshToken = await refreshTokenRotation(
    //   refreshTokenUserId,
    //   refreshToken
    // );
    const newAccessToken = signNewAccessToken(refreshTokenUserId);
    response.result = {
      refreshToken: refreshToken,
      accessToken: newAccessToken,
    };
    response.success = true;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
