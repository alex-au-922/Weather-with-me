const { UnauthorizationError } = require("../../../errorConfig");
const {
  checkUserCredentialsById,
} = require("../../../generalUtils/userCreds/username");
const usernameCheck = async (req, res, next) => {
  try {
    const { username } = req.body;
    const decryptedUserId = res.locals.decryptedUserId;
    if (decryptedUserId) {
      const existsUser = await checkUserCredentialsById(decryptedUserId);
      if (existsUser === null || username !== existsUser.username)
        throw new UnauthorizationError("unauthorized_action");
      res.locals.user = existsUser;
    }
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = usernameCheck;
