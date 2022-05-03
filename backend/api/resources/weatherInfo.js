const express = require("express");
const decryptAccessToken =
  require("../../generalUtils/userCreds/accessToken").decryptAccessToken;
const checkUserCredentialsById =
  require("../../generalUtils/userCreds/username").checkUserCredentialsById;
const getLatestWeatherData =
  require("../../databaseUtils/weatherDatabase/getLatestData").getLatestData;
const { HTTP_STATUS } = require("../../backendConfig");
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

  const { accessToken, username } = req.body;
  try {
    const {
      success: decryptSuccess,
      errorType: decryptErrorType,
      error: decryptError,
      result: decryptResult,
    } = decryptAccessToken(accessToken);
    if (decryptSuccess) {
      // successfully decrypted accessToken
      const {
        success: userInfoSuccess,
        user,
        error: userInfoError,
        errorType: userInfoErrorType,
      } = await checkUserCredentialsById(decryptResult);
      if (userInfoSuccess) {
        if (user.role === "admin" && user.username == username) {
          const {
            success: getUserDataSuccess,
            error: getUserDataError,
            errorType: getUserDataErrorType,
            result,
          } = await getLatestWeatherData();
          if (getUserDataSuccess) {
            status = HTTP_STATUS.success.ok.status;
            response.success = true;
            response.result = result;
          } else {
            response.error = getUserDataError;
            response.errorType = getUserDataErrorType;
          }
        } else {
          status = HTTP_STATUS.clientError.unauthorized.status;
          response.error = "Don't hack me!";
          response.errorType = "UNAUTHORIZED_ERROR";
        }
      } else {
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
