//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const bcrypt = require("bcrypt");
const {
  InvalidRefreshTokenError,
  DatabaseError,
  UnauthorizationError,
} = require("../../errorConfig");
const { connectUserDB } = require("../database");
const { dateExpired, offsetTime } = require("../time/offsetTime");
const refreshTokenSchema = require("../../backendConfig").databaseConfig
  .refreshTokenSchema;
const userSchema = require("../../backendConfig").databaseConfig.userSchema;
const randomString = require("../randomString").randomString;

const refreshTokenHash = async (refreshToken) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    return hashedRefreshToken;
  } catch (error) {
    throw new InvalidRefreshTokenError("Invalid refresh token format!");
  }
};

const generateRefreshToken = async () => {
  const refreshToken = randomString(16);
  const hashedRefreshToken = await refreshTokenHash(refreshToken);
  const response = {
    refreshToken,
    hashedRefreshToken,
  };
  return response;
};

const updateUserRefreshToken = async (userId, refreshTokenHash) => {
  const userDB = await connectUserDB();
  const RefreshTokenModel = userDB.model("RefreshToken", refreshTokenSchema);
  const userHasPreviousToken = await RefreshTokenModel.findOne({ userId });
  const newTokenData = {
    userId,
    refreshTokenHash,
    createdTime: offsetTime(0),
    expiredTime: offsetTime(1000 * 60 * 60 * 24 * 7), // 7 days
  };
  let result;
  if (userHasPreviousToken === null) {
    result = await RefreshTokenModel.create(newTokenData);
  } else {
    result = await RefreshTokenModel.updateOne({ userId }, newTokenData);
  }
  return result;
};

const compareRefreshToken = async (refreshToken, hashedRefreshToken) => {
  try {
    const refreshTokenCorrect = await bcrypt.compare(
      refreshToken,
      hashedRefreshToken
    );
    return refreshTokenCorrect;
  } catch (error) {
    throw new InvalidRefreshTokenError("Invalid refresh token format!");
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

const tokenUpdate = async (userId, oldRefreshToken = null) => {
  const userDB = await connectUserDB();
  const UserModel = userDB.model("User", userSchema);
  const RefreshTokenModel = userDB.model("RefreshToken", refreshTokenSchema);
  const refreshTokenUser = await UserModel.findById(userId);
  if (refreshTokenUser === null)
    throw new UnauthorizationError("Unauthorized action!");

  if (oldRefreshToken !== null) {
    const refreshTokenUser = await RefreshTokenModel.findOne({ userId });
    const oldRefreshTokenCorrect = await compareRefreshToken(
      oldRefreshToken,
      refreshTokenUser.refreshTokenHash
    );
    if (!oldRefreshTokenCorrect)
      throw new UnauthorizationError("Unauthorized action!");
  }

  let newRefreshTokenUnique = false;
  let hashedRefreshToken;
  let refreshToken;
  while (!newRefreshTokenUnique) {
    const generateTokenResult = await generateRefreshToken();
    refreshToken = generateTokenResult.refreshToken;
    hashedRefreshToken = generateTokenResult.hashedRefreshToken;
    const refreshTokenUser = await findValidRefreshToken(refreshToken);
    if (refreshTokenUser !== null) continue; // duplicated hash
    newRefreshTokenUnique = true;
  }
  await updateUserRefreshToken(userId, hashedRefreshToken);
  return refreshToken;
};

const findValidRefreshToken = async (refreshToken) => {
  const userDB = await connectUserDB();
  const RefreshTokenModel = userDB.model("RefreshToken", refreshTokenSchema);

  const allUserTokens = await RefreshTokenModel.find();
  const validRefreshTokens = await Promise.all(
    allUserTokens.map(
      async (userTokenInfo) =>
        await validateUserRefreshToken(refreshToken, userTokenInfo)
    )
  );
  const validRefreshToken = validRefreshTokens.filter(
    (userRefreshToken) => userRefreshToken.valid
  );
  if (!validRefreshToken.length) return null;
  return validRefreshToken[0].userId;
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
