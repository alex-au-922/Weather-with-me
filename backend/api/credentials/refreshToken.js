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
const { InvalidRefreshTokenError } = require("../../errorConfig");
router.post("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
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
    response.success = true;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
