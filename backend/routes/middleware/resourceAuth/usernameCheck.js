//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const { UnauthorizationError } = require("../../../errorConfig");
const {
  checkUserCredentialsById,
} = require("../../../generalUtils/userCreds/username");
const usernameCheck = async (req, res, next) => {
  try {
    const username = req.headers.username;
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
