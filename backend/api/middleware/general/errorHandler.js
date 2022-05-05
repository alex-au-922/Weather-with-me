const {
  InternalServerError,
  DatabaseError,
  UsernameError,
  PasswordError,
  InvalidRefreshTokenError,
  InvalidAccessTokenError,
  UnauthorizationError,
  UnknownError,
} = require("../../../errorConfig");
const { HTTP_STATUS } = require("../../../backendConfig");

const errorHandler = async (error, req, res, next) => {
  const response = res.locals.response;
  switch (error.constructor) {
    case UsernameError:
    case PasswordError:
    case InvalidRefreshTokenError:
    case InvalidAccessTokenError:
    case UnauthorizationError:
      res.status(HTTP_STATUS.clientError.unauthorized.status);
      break;
    default:
      res.status(HTTP_STATUS.serverError.internalServerError.status);
      break;
  }
  response.error = error.message;
  response.errorType = error.name;
  next();
};
module.exports = errorHandler;
