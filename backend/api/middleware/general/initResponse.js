const { HTTP_STATUS } = require("../../../backendConfig");

const initResponse = async (req, res, next) => {
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
};
module.exports = initResponse;
