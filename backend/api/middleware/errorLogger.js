const logger = require("../../generalUtils/getLogger").getLogger();

const errorLogger = (err, req, res, next) => {
  const errorString = `[${err.name}] > ${err.stack}`;
  logger.error(errorString);
  next(err);
};
module.exports = errorLogger;
