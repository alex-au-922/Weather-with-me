const express = require("express");
const {
  signNewAccessToken,
} = require("../../generalUtils/userCreds/accessToken");
const router = express.Router();
const comparePassword =
  require("../../generalUtils/userCreds/password").comparePassword;
const checkUserCredentials =
  require("../../generalUtils/userCreds/username").checkUserCredentials;
const HTTP_STATUS = require("../../backendConfig").HTTP_STATUS;
const issueNewRefreshToken =
  require("../../generalUtils/userCreds/refreshToken").issueNewRefreshToken;

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  res.setHeader("Content-Type", "application/json");
  let status = HTTP_STATUS.serverError.internalServerError.status;
  const response = {
    success: false,
    error: null,
    errorType: null,
    refreshToken: null,
    accessToken: null,
  };
  try {
    const {
      success: userValidateSuccess,
      error: userValidateError,
      errorType: userValidateErrorType,
      user,
    } = await checkUserCredentials("username", username);
    if (userValidateSuccess) {
      // if username exists
      const passwordCorrect = await comparePassword(password, user.password);
      if (passwordCorrect) {
        // if password correct
        const {
          success: issueTokenSuccess,
          token: newRefreshToken,
          error: tokenIssueError,
          errorType: tokenIssueErrorType,
        } = await issueNewRefreshToken(user._id);
        if (issueTokenSuccess) {
          status = HTTP_STATUS.success.ok.status;
          response.success = true;
          response.refreshToken = newRefreshToken;
          response.accessToken = signNewAccessToken(user._id);
        } else {
          response.error = tokenIssueError;
          response.errorType = tokenIssueErrorType;
        }
      } else {
        // correct username, wrong password
        status = HTTP_STATUS.clientError.unauthorized.status;
        response.errorType = "password";
        response.error = "Password incorrect!";
      }
    } else {
      // when validating username error exists
      if (user === null) {
        status = HTTP_STATUS.clientError.unauthorized.status;
        response.errorType = "username";
        response.error = "Username does not exist!";
      } else {
        response.errorType = userValidateError;
        response.error = userValidateErrorType;
      }
    }
  } catch (error) {
    response.errorType = HTTP_STATUS.serverError.internalServerError.statusType;
    response.error = error;
  } finally {
    const jsonReponse = JSON.stringify(response);
    res.status(status).send(jsonReponse);
  }
});

module.exports = router;
