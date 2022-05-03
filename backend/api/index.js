const signup = require("./signup/signup");
const login = require("./credentials/login");
const singleUser = require("./resources/singleUserInfo");
const allUser = require("./resources/allUsersInfo");
const allWeather = require("./resources/weatherInfo");
const resetPw = require("./resetpw/resetPw");
const resetPwEmail = require("./resetpw/sendResetPwEmail");
const userHash = require("./resetpw/userHash");
const refreshToken = require("./credentials/refreshToken");
const updateUserData = require("./changeSettings/settings");

const api = (app) => {
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
