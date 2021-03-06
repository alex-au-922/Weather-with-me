//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const {
  UsernameError,
  PasswordError,
  EmailError,
  InvalidRefreshTokenError,
  InvalidAccessTokenError,
  LocationNameError,
  ValueError,
  UnauthorizationError,
  NotFoundError,
} = require("../../../errorConfig");
const { HTTP_STATUS } = require("../../../backendConfig");

const errorHandler = async (error, req, res, next) => {
  const response = res.locals.response;
  switch (error.constructor) {
    case UsernameError:
    case PasswordError:
    case EmailError:
    case LocationNameError:
    case ValueError:
      res.status(HTTP_STATUS.clientError.notAccepted.status);
      break;
    case InvalidRefreshTokenError:
      res.status(HTTP_STATUS.clientError.forbidden.status);
      break;
    case InvalidAccessTokenError:
    case UnauthorizationError:
      res.status(HTTP_STATUS.clientError.unauthorized.status);
      break;
    case NotFoundError:
      res.status(HTTP_STATUS.clientError.notFound.status);
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
