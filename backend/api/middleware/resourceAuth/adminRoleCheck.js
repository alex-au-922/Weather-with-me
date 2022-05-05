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
