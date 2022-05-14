//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

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
