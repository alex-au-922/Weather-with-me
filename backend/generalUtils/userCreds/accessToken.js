const jwtEncrpyt = require("../jwt/encrypt").encrypt;
const jwtDecrypt = require("../jwt/decrypt").decrypt;
const ACCESS_TOKEN_EXPIRED_TIME =
  require("../../backendConfig").ACCESS_TOKEN_EXPIRED_TIME;
const jwt = require("jsonwebtoken");
const {
  InternalServerError,
  InvalidAccessTokenError,
} = require("../../errorConfig");

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
  try {
    const jwtDecryptResult = jwtDecrypt(accessToken);
    return jwtDecryptResult.userId;
  } catch (error) {
    throw new InvalidAccessTokenError(error);
  }
};

exports.signNewAccessToken = signNewAccessToken;
exports.decryptAccessToken = decryptAccessToken;
