const {
  decryptAccessToken,
} = require("../../../generalUtils/userCreds/accessToken");

const resourceAuthorizationCheck = async (req, res, next) => {
  try {
    const { accessToken } = req.body;
    const userId = decryptAccessToken(accessToken);
    res.locals.decryptedUserId = userId;
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = resourceAuthorizationCheck;
