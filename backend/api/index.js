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
