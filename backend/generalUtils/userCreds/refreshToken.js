const bcrypt = require("bcrypt");
const { connectUserDB } = require("../database");
const { dateExpired, offsetTime } = require("../time/offsetTime");
const refreshTokenSchema = require("../../backendConfig").databaseConfig.refreshTokenSchema;
const userSchema = require("../../backendConfig").databaseConfig.userSchema;
const HTTP_STATUS = require("../../backendConfig").HTTP_STATUS;
const randomHash = require("./userHash").randomHash;

const refreshTokenHash = async (refreshToken) => {
  const salt = await bcrypt.genSalt(10);
  const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
  return hashedRefreshToken;
};

const generateRefreshToken = async () => {
  const refreshToken = randomHash(16);
  const hashedRefreshToken = await refreshTokenHash(refreshToken);
  const response = {
    refreshToken,
    hashedRefreshToken,
  };
  return response;
};

const updateUserRefreshToken = async (userId, refreshTokenHash) => {
    const userDB = await connectUserDB();
    const response = {
        success: false,
        errorType: null,
        error: null,
        result: null
    }
  try {
    const UserModel = userDB.model("User", userSchema);
       const RefreshTokenModel = userDB.model(
         "RefreshToken",
         refreshTokenSchema
       );
    const userHasPreviousToken = await RefreshTokenModel.findOne({ userId });
    const newTokenData = {
      userId,
      refreshTokenHash,
      createdTime: offsetTime(0),
      expiredTime: offsetTime(1000*60*60*24*7), // 7 days
    }
    let result;
    if (userHasPreviousToken === null) {
      result = await RefreshTokenModel.create(newTokenData);
    }
    else {
      result = await RefreshTokenModel.updateOne({ userId }, newTokenData);
    }
    response.success = true;
    response.result = result;
        return response
     } catch (error) {
       response.errorType =
         HTTP_STATUS.serverError.internalServerError.statusType;
       response.error = error;
       return response;
     }
}

const compareRefreshToken = async (refreshToken, hashedRefreshToken) => {
  try {
    const refreshTokenCorrect = await bcrypt.compare(
      refreshToken,
      hashedRefreshToken
    );
    return refreshTokenCorrect;
  } catch (error) {
    return false;
  }
};

const validateUserRefreshToken = async (refreshToken, userTokenInfo) => {
  const { userId, refreshTokenHash, expiredTime } = userTokenInfo;
  const response = {
    userId,
    valid: false,
  };
  const refreshTokenCorrect = await compareRefreshToken(
    refreshToken,
    refreshTokenHash
  );
  const validRefreshToken = refreshTokenCorrect && !dateExpired(expiredTime);
  response.valid = validRefreshToken;
  return response;
};

const tokenUpdate = async (userId, oldRefreshToken = null) =>{
  const userDB = await connectUserDB();
  const response = {
    success: false,
    token: null,
    error: null,
    errorType: null,
  };
  try {
    const UserModel = userDB.model("User", userSchema);
    const RefreshTokenModel = userDB.model("RefreshToken", refreshTokenSchema);
    const refreshTokenUser = await UserModel.findById(userId);
    if (refreshTokenUser === null) {
      response.errorType = HTTP_STATUS.clientError.unauthorized.statusType;
      response.error = "unauthorized action";
      return response;
    }

    if (oldRefreshToken !== null) {
      const refreshTokenUser = await RefreshTokenModel.findOne({ userId });
      console.log(refreshTokenUser, oldRefreshToken);
      const oldRefreshTokenCorrect = await compareRefreshToken(
        oldRefreshToken,
        refreshTokenUser.refreshTokenHash
      );
      console.log("oldRefreshTokenCorrect", oldRefreshTokenCorrect);
      if (!oldRefreshTokenCorrect) {
        response.errorType = HTTP_STATUS.clientError.unauthorized.statusType;
        response.error = "unauthorized action";
        return response;
      }
    }
      let newRefreshTokenUnique = false;
      let hashedRefreshToken;
    let refreshToken;
    while (!newRefreshTokenUnique) {
        const generateTokenResult = await generateRefreshToken();
      refreshToken = generateTokenResult.refreshToken;
        hashedRefreshToken = generateTokenResult.hashedRefreshToken;
      const { success: tokenDuplicated, errorType: tokenDuplicatedError} =
        await findValidRefreshToken(refreshToken);
      if (tokenDuplicated) continue; // duplicated hash
      else if (tokenDuplicatedError !== "INVALID_TOKEN_ERROR") continue; //server internal error
      newRefreshTokenUnique = true;
    }
    const { success: updateTokenSuccess, error: updateTokenError, errorType: updateTokenErrorType } = await updateUserRefreshToken(userId, hashedRefreshToken);
      if (!updateTokenSuccess) {
          response.errorType = updateTokenErrorType;
          response.error = updateTokenError;
          return response;
      }
      response.success = updateTokenSuccess;
    response.token = refreshToken;    
    return response
  } catch (error) {
      response.errorType =
        HTTP_STATUS.serverError.internalServerError.statusType;
    response.error = error;
    console.log(response);
      return response;
  }
}

const findValidRefreshToken = async (refreshToken) => {
  const userDB = await connectUserDB();
  const response = {
    success: false,
    result: null,
    errorType: null,
    error: null,
  };
  try {
    const RefreshTokenModel = userDB.model("RefreshToken", refreshTokenSchema);

    const allUserTokens = await RefreshTokenModel.find();
    const validRefreshTokens = await Promise.all(
      allUserTokens.map(async (userTokenInfo) =>
        await validateUserRefreshToken(refreshToken, userTokenInfo)
      )
    );
    const validRefreshToken = validRefreshTokens.filter(
      (userRefreshToken) => userRefreshToken.valid
    );
    if (!validRefreshToken.length) {
      response.errorType = "INVALID_TOKEN_ERROR";
      response.error = "token invalid!";
      return response;
    }
    response.success = true;
    response.result = validRefreshToken[0].userId;
    return response;
  } catch (error) {
    response.errorType = HTTP_STATUS.serverError.internalServerError.statusType;
    response.error = error;
    return response;
  }
};

const refreshTokenRotation = async (userId, oldRefreshToken) => {
  return await tokenUpdate(userId, oldRefreshToken);
};

const issueNewRefreshToken = async (userId) => {
  return await tokenUpdate(userId);  
};

exports.findValidRefreshToken = findValidRefreshToken;
exports.refreshTokenRotation = refreshTokenRotation;
exports.issueNewRefreshToken = issueNewRefreshToken;