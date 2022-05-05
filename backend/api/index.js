const signup = require("./signup/signup");
const login = require("./credentials/login");
const resourcesData = require("./resources/data");
const resetPw = require("./resetpw/resetPw");
const resetPwEmail = require("./resetpw/sendResetPwEmail");
const userHash = require("./resetpw/userHash");
const refreshToken = require("./credentials/refreshToken");
const updateUserData = require("./resources/update/settings");
const initResponse = require("./middleware/general/initResponse");
const errorHandler = require("./middleware/general/errorHandler");
const errorLogger = require("./middleware/general/errorLogger");
const allowCors = require("./middleware/general/allowCors");
const sendResponse = require("./middleware/general/sendResponse");

const api = (app) => {
  app.use(allowCors);
  app.use(initResponse);
  app.use("/signup", signup);
  app.use("/login", login);
  app.use("/token/refresh", refreshToken);
  app.use("/resetpw", resetPw);
  app.use("/resetpw/email", resetPwEmail);
  app.use("/userhash", userHash);
  app.use("/resources/data", resourcesData);
  app.use("/setting/update", updateUserData);
  app.use(errorLogger);
  app.use(errorHandler);
  app.use(sendResponse);
  return app;
};

module.exports = api;
