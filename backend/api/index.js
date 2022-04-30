const signup = require("./signup/signup");
const login = require("./login/login");
const decrypt = require("./login/decrypt");
const allUser = require("./appinfo/userInfo");
const allWeather = require("./appinfo/weatherInfo");
const resetPw = require("./resetpw/resetPw");
const resetPwEmail = require("./resetpw/sendResetPwEmail");
const userHash = require("./resetpw/userHash");
const updateEmail = require("./changeSettings/email");
const updateViewMode = require("./changeSettings/viewMode");

const api = (app) => {
  app.use("/signup", signup);
  app.use("/login", login);
  app.use("/decrypt", decrypt);
  app.use("/resetpw", resetPw);
  app.use("/resetpw/email", resetPwEmail);
  app.use("/userhash", userHash);
  app.use("/user/all", allUser);
  app.use("/weather/all", allWeather);
  app.use("/setting/email", updateEmail);
  app.use("/setting/viewMode", updateViewMode);
  return app;
};

module.exports = api;
