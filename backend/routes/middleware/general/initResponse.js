const { HTTP_STATUS } = require("../../../backendConfig");

const initResponse = async (req, res, next) => {
  try {
    const response = {
      success: false,
      error: null,
      errorType: null,
      result: null,
    };
    res.locals.response = response;
    res.setHeader("Content-Type", "application/json");
    res.status(HTTP_STATUS.success.ok.status);
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = initResponse;
