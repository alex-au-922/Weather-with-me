const express = require("express");
const passwordUtils = require("../../generalUtils/userCreds/password");
const {
  checkUserCredentialsById,
} = require("../../generalUtils/userCreds/username");
const decryptAccessToken =
  require("../../generalUtils/userCreds/accessToken").decryptAccessToken;
const passwordHash = passwordUtils.passwordHash;
const updatePassword = passwordUtils.updatePassword;
const comparePassword = passwordUtils.comparePassword;
const logger = require("../../generalUtils/getLogger").getLogger();
const deleteResetPasswordRecord =
  require("../../databaseUtils/userDatabase/resetPw").deleteResetPasswordRecord;
const { HTTP_STATUS } = require("../../backendConfig");
const eventEmitter = require("../_eventEmitter");
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

  const { username, password, accessToken, hash } = req.body;
  try {
    if (!accessToken && !hash) {
      status = HTTP_STATUS.clientError.unauthorized.status;
      response.error = "unauthorized_action";
      response.errorType = HTTP_STATUS.clientError.unauthorized.statusType;
    } else {
      let userIdentityConfirmed = false;
      let userOldPasswordHash;
      if (accessToken) {
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
            if (user.username == username) {
              userIdentityConfirmed = true;
              userOldPasswordHash = user.password;
            } else {
              status = HTTP_STATUS.clientError.unauthorized.status;
              response.error = "unauthorized_action";
              response.errorType =
                HTTP_STATUS.clientError.unauthorized.statusType;
            }
          } else {
            response.error = userInfoError;
            response.errorType = userInfoErrorType;
          }
        } else {
          response.error = decryptError;
          response.errorType = decryptErrorType;
        }
      } else {
        userIdentityConfirmed = true;
      }
      if (userIdentityConfirmed) {
        const passwordSame = await comparePassword(
          password,
          userOldPasswordHash
        );
        if (passwordSame) {
          response.errorType = "password";
          response.error = "New password cannot be the same as old password!";
        } else {
          const hashedPassword = await passwordHash(password);
          const userInfo = { username, password: hashedPassword };
          const {
            success: updatePasswordSuccess,
            error: updatePasswordError,
            errorType: updatePasswordErrorType,
          } = await updatePassword(userInfo);
          if (updatePasswordSuccess) {
            status = HTTP_STATUS.success.ok.status;
            response.success = true;
            await deleteResetPasswordRecord(username);
            eventEmitter.emit("updateUserData");
          } else {
            response.error = updatePasswordError;
            response.errorType = updatePasswordErrorType;
          }
        }
      }
    }
  } catch (error) {
  } finally {
    const jsonResponse = JSON.stringify(response);
    res.status(status).send(jsonResponse);
  }
});

module.exports = router;
