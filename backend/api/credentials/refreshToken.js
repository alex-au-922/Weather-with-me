const express = require("express");
const { apiResponseWrapper } = require("../_apiWrapper");
const logger = require("../../generalUtils/getLogger").getLogger();
const router = express.Router();
const HTTP_STATUS = require("../../backendConfig").HTTP_STATUS;
const findValidRefreshToken =
  require("../../generalUtils/userCreds/refreshToken").findValidRefreshToken;
const refreshTokenRotation =
  require("../../generalUtils/userCreds/refreshToken").refreshTokenRotation;
const signNewAccessToken =
  require("../../generalUtils/userCreds/accessToken").signNewAccessToken;

router.post(
  "/",
  async (req, res) => {
    const response = {
      success: true,
      error: null,
      errorType: null,
      result: null,
    };
    res.status(200);
    const { refreshToken } = req.body;
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
    res.send(JSON.stringify(response));
  }
  // apiResponseWrapper(async (req, _) => {
  //   const { refreshToken } = req.body;
  //   const refreshTokenUserId = await findValidRefreshToken(refreshToken);
  //   const newRefreshToken = await refreshTokenRotation(
  //     refreshTokenUserId,
  //     refreshToken
  //   );
  //   const newAccessToken = signNewAccessToken(refreshTokenUserId);
  //   return {
  //     refreshToken: newRefreshToken,
  //     accessToken: newAccessToken,
  //   };
  // })
);

module.exports = router;
