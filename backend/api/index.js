const signup = require("./signup/signup");
const login = require("./credentials/login");
const singleUser = require("./resources/data/singleUserInfo");
const allUser = require("./resources/data/allUsersInfo");
const allWeather = require("./resources/data/weatherInfo");
const resetPw = require("./resetpw/resetPw");
const resetPwEmail = require("./resetpw/sendResetPwEmail");
const userHash = require("./resetpw/userHash");
const refreshToken = require("./credentials/refreshToken");
const updateUserData = require("./resources/settings/settings");
const initResponse = require("./middleware/initResponse");
const errorHandler = require("./middleware/errorHandler");
const errorLogger = require("./middleware/errorLogger");

const api = (app) => {
  // app.use(initResponse);
  // app.use(errorLogger);
  // app.use(errorHandler);
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });
  app.use("/signup", signup);
  app.use("/login", login);
  app.use("/token/refresh", refreshToken);
  app.use("/resetpw", resetPw);
  app.use("/resetpw/email", resetPwEmail);
  app.use("/userhash", userHash);
  app.use("/user/all", allUser);
  app.use("/user", singleUser);
  app.use("/weather/all", allWeather);
  app.use("/setting/update", updateUserData);
  return app;
};

module.exports = api;
