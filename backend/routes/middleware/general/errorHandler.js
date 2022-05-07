const {
  UsernameError,
  PasswordError,
  InvalidRefreshTokenError,
  InvalidAccessTokenError,
  UnauthorizationError,
  MethodNotAllowedError,
} = require("../../../errorConfig");
const { HTTP_STATUS } = require("../../../backendConfig");

const errorHandler = async (error, req, res, next) => {
  const response = res.locals.response;
  switch (error.constructor) {
    case UsernameError:
    case PasswordError:
      res.status(HTTP_STATUS.clientError.notFound.status);
      break;
    case InvalidRefreshTokenError:
      res.status(HTTP_STATUS.clientError.forbidden.status);
      break;
    case InvalidAccessTokenError:
    case UnauthorizationError:
      res.status(HTTP_STATUS.clientError.unauthorized.status);
      break;
    case MethodNotAllowedError:
      res.status(HTTP_STATUS.clientError.methodNotAllowed.status);
      break;
    default:
      res.status(HTTP_STATUS.serverError.internalServerError.status);
      break;
  }
  response.error = error.message;
  response.errorType = error.name;
  res.send(JSON.stringify(response));
};
module.exports = errorHandler;