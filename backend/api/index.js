const signup = require("./signup/signup");
const login = require("./login/login");
const decrypt = require("./decrypt");
const resetPw = require("./resetpw/resetPw");
const resetPwEmail = require("./resetpw/sendResetPwEmail");
const userHash = require("./resetpw/userHash");

const api = (app) => {
  app.use("/signup", signup);
  app.use("/login", login);
  app.use("/decrypt", decrypt);
  app.use("/resetpw", resetPw);
  app.use("/resetpw/email", resetPwEmail);
  app.use("/userhash", userHash);
  return app;
};

module.exports = api;
