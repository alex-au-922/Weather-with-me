const logger = require("../../../generalUtils/getLogger").getLogger();

const errorLogger = async (error, req, res, next) => {
  const errorString = `[${error.name}] > ${error.stack}`;
  logger.error(errorString);
  next(error);
};
module.exports = errorLogger;
