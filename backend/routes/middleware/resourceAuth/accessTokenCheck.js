const { UnauthorizationError } = require("../../../errorConfig");
const {
  decryptAccessToken,
} = require("../../../generalUtils/userCreds/accessToken");

const resourceAuthorizationCheck = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    if (accessToken === undefined)
      throw new UnauthorizationError("Unauthorized Action!");
    const userId = decryptAccessToken(accessToken);
    res.locals.decryptedUserId = userId;
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = resourceAuthorizationCheck;
