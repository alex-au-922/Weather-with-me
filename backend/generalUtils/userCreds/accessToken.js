//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

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
