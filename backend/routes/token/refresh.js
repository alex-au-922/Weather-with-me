//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

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
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
