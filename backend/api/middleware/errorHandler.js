const {
  InternalServerError,
  DatabaseError,
  UsernameError,
  PasswordError,
  InvalidRefreshTokenError,
  InvalidAccessTokenError,
  UnauthorizationError,
  UnknownError,
} = require("../../errorConfig");

const errorHandler = (err, req, res, next) => {
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
  const response = JSON.stringify({
    success: false,
    error: err.message,
    errorType: error.name,
    result: null,
  });
  res.send(response);
};
module.exports = errorHandler;
