const { HTTP_STATUS } = require("../backendConfig");
const {
  InternalServerError,
  DatabaseError,
  UsernameError,
  PasswordError,
  InvalidRefreshTokenError,
  InvalidAccessTokenError,
  UnauthorizationError,
  UnknownError,
} = require("../errorConfig");
const logger = require("../generalUtils/getLogger").getLogger();

/*
Usage: 
app.xxx("yyy", apiResponseWrapper(async(req, res)=>{
    <Write your code here>
}))

The wrapped function (func) must only accept req and res as parameters!
*/

const apiResponseWrapper = (func) => {
  const wrappedApiFunc = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let status;
    const response = {
      //unified response
      success: false,
      error: null,
      errorType: null,
      result: null,
    };
    try {
      response.result = await func(req, res);
      response.success = true;
    } catch (error) {
      switch (error.constructor) {
        case UsernameError:
        case PasswordError:
        case InvalidRefreshTokenError:
        case InvalidAccessTokenError:
        case UnauthorizationError:
          status = HTTP_STATUS.clientError.unauthorized.status;
          break;
        default:
          status = HTTP_STATUS.serverError.internalServerError.status;
          break;
      }
      response.error = error.message;
      response.errorType = error.name;
      logger.error(`[${error.name}]: ${error.message}`);
    } finally {
      if (response.success) status = HTTP_STATUS.success.ok.status;
      const jsonResponse = JSON.stringify(response);
      res.status(status).send(jsonResponse);
    }
  };
  return wrappedApiFunc;
};

exports.apiResponseWrapper = apiResponseWrapper;
