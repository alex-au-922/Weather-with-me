const express = require("express");
const logger = require("../../generalUtils/getLogger").getLogger();
const router = express.Router();
const HTTP_STATUS = require("../../backendConfig").HTTP_STATUS;
const findValidRefreshToken =
  require("../../generalUtils/userCreds/refreshToken").findValidRefreshToken;
const refreshTokenRotation =
  require("../../generalUtils/userCreds/refreshToken").refreshTokenRotation;
const signNewAccessToken =
  require("../../generalUtils/userCreds/accessToken").signNewAccessToken;

router.post("/", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let status = HTTP_STATUS.serverError.internalServerError.status;

  const response = {
    success: false,
    error: null,
    errorType: null,
    refreshToken: null,
    accessToken: null,
  };

  const { refreshToken } = req.body;
  try {
    const {
      success: validTokenSuccess,
      result: refreshTokenUserId,
      error: validTokenError,
      errorType: validTokenErrorType,
    } = await findValidRefreshToken(refreshToken);
    if (validTokenSuccess) {
      const {
        success: rotateTokenSuccess,
        token: newRefreshToken,
        error: tokenRotationError,
        errorType: tokenRotationErrorType,
      } = await refreshTokenRotation(refreshTokenUserId, refreshToken);
      if (rotateTokenSuccess) {
        status = HTTP_STATUS.success.ok.status;
        response.success = true;
        response.refreshToken = newRefreshToken;
        response.accessToken = signNewAccessToken(refreshTokenUserId);
      } else {
        status = HTTP_STATUS.serverError.internalServerError.status;
        response.error = tokenRotationError;
        response.errorType = tokenRotationErrorType;
      }
    } else {
      status = HTTP_STATUS.clientError.unauthorized.status;
      response.error = validTokenError;
      response.errorType = validTokenErrorType;
    }
  } catch (error) {
    logger.error(error);
    response.error = error;
    response.errorType = HTTP_STATUS.clientError.internalServerError.statusType;
  } finally {
    const jsonResponse = JSON.stringify(response);
    res.status(status).send(jsonResponse);
  }
});

module.exports = router;
