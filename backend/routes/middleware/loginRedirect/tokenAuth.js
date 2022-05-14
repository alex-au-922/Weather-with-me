//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const { InvalidRefreshTokenError } = require("../../../errorConfig");

const tokenAuthentication = async (req, res, next) => {
  try {
    const refreshToken = req.headers.authentication;
    if (refreshToken === undefined)
      throw new InvalidRefreshTokenError("Invalid refresh token!");
    res.redirect("./token/refresh");
  } catch (error) {
    next(error);
  }
};

module.exports = tokenAuthentication;
