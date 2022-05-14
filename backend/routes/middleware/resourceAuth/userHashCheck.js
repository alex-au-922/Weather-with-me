//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const { UnauthorizationError } = require("../../../errorConfig");
const {
  findUserByHash,
} = require("../../../databaseUtils/userDatabase/resetPw");
const { dateExpired } = require("../../../generalUtils/time/offsetTime");

const userHashCheck = async (req, res, next) => {
  try {
    const userHash = req.params.userHash;
    const { userId: decryptedUserId, expiredTime } = await findUserByHash(
      userHash
    );
    if (decryptedUserId === null || dateExpired(expiredTime))
      throw new UnauthorizationError("Unauthorized Action!");
    res.locals.decryptedUserId = decryptedUserId;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = userHashCheck;
