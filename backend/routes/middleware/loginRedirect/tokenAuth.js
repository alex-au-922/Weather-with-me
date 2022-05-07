const { InvalidRefreshToken } = require("../../../errorConfig");
const tokenAuthentication = async (req, res, next) => {
  try {
    const refreshToken = req.headers.authentication;
    if (refreshToken === undefined)
      throw new InvalidRefreshToken("Invalid refresh token!");
    res.redirect("./token/refresh");
  } catch (error) {
    next(error);
  }
};

module.exports = tokenAuthentication;
