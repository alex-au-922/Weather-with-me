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
