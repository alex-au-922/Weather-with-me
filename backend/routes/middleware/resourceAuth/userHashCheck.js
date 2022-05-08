const { UnauthorizationError } = require("../../../errorConfig");
const {
  findUserByHash,
} = require("../../../databaseUtils/userDatabase/resetPw");
const userHashCheck = async (req, res, next) => {
  try {
    const userHash = req.params.userHash;
    const decryptedUserId = await findUserByHash(userHash);
    if (decryptedUserId === null)
      throw new UnauthorizationError("Unauthorized Action!");
    res.locals.decryptedUserId = decryptedUserId;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = userHashCheck;
