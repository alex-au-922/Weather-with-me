const jwtEncrpyt = require("../jwt/encrypt").encrypt;
const jwtDecrypt = require("../jwt/decrypt").decrypt;
const ACCESS_TOKEN_EXPIRED_TIME =
  require("../../backendConfig").ACCESS_TOKEN_EXPIRED_TIME;
const jwt = require("jsonwebtoken");
const { InternalServerError } = require("../../errorConfig");
const HTTP_STATUS = require("../../backendConfig").HTTP_STATUS;

const signNewAccessToken = (userId) => {
  try {
    const jwtStore = { userId: userId.toString() };
    const newAccessToken = jwtEncrpyt(jwtStore, ACCESS_TOKEN_EXPIRED_TIME);
    return newAccessToken;
  } catch (error) {
    throw new InternalServerError("Cannot create new access token!");
  }
};

const decryptAccessToken = (accessToken) => {
  const response = {
    success: false,
    errorType: null,
    error: null,
    result: null,
  };
  try {
    const jwtDecryptResult = jwtDecrypt(accessToken);
    response.success = true;
    response.result = jwtDecryptResult.userId;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      response.errorType = "ACCESS_TOKEN_EXPIRED_ERROR";
      response.error = "expired_access_token";
    } else if (error instanceof jwt.JsonWebTokenError) {
      response.errorType = HTTP_STATUS.clientError.unauthorized.statusType;
      response.error = "unauthorized_action";
    } else {
      response.errorType =
        HTTP_STATUS.serverError.internalServerError.statusType;
      response.error = "internal_server_error";
    }
  } finally {
    return response;
  }
};

exports.signNewAccessToken = signNewAccessToken;
exports.decryptAccessToken = decryptAccessToken;
