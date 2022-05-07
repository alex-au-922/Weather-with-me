const sendResponse = async (req, res, next) => {
  const response = res.locals.response;
  res.send(JSON.stringify(response));
};
module.exports = sendResponse;
