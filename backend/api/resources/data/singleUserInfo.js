const express = require("express");
const checkUserCredentialsById =
  require("../../../generalUtils/userCreds/username").checkUserCredentialsById;
const decryptAccessToken =
  require("../../../generalUtils/userCreds/accessToken").decryptAccessToken;
const HTTP_STATUS = require("../../../backendConfig").HTTP_STATUS;
const router = express.Router();

router.post("/", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let status = HTTP_STATUS.serverError.internalServerError.status;

  const response = {
    success: false,
    error: null,
    errorType: null,
    result: null,
  };
  const { accessToken } = req.body;
  try {
    const {
      success: decryptSuccess,
      errorType: decryptErrorType,
      error: decryptError,
      result: decryptResult,
    } = decryptAccessToken(accessToken);
    if (decryptSuccess) {
      const {
        success: userInfoSuccess,
        user,
        error: userInfoError,
        errorType: userInfoErrorType,
      } = await checkUserCredentialsById(decryptResult);
      if (userInfoSuccess) {
        status = HTTP_STATUS.success.ok.status;
        response.result = user;
        response.success = true;
      } else {
        status = HTTP_STATUS.clientError.unauthorized.status;
        response.error = userInfoError;
        response.errorType = userInfoErrorType;
      }
    } else {
      response.error = decryptError;
      response.errorType = decryptErrorType;
    }
  } catch (error) {
    response.error = error;
    response.errorType = HTTP_STATUS.serverError.internalServerError.statusType;
  } finally {
    const jsonResponse = JSON.stringify(response);
    res.status(status).send(jsonResponse);
  }
});

module.exports = router;
