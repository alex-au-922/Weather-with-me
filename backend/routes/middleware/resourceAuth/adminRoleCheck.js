//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const { UnauthorizationError } = require("../../../errorConfig");

const adminRoleCheck = async (req, res, next) => {
  try {
    const user = res.locals.user;
    if (user && user.role !== "admin")
      throw new UnauthorizationError("unauthorized_action");
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = adminRoleCheck;
