const signup = require("./signup");
const login = require("./login");
const decrypt = require("./decrypt");

const api = (app) => {
  app.use("/signup", signup);
  app.use("/login", login);
  app.use("/decrypt", decrypt);
  return app;
};

module.exports = api;
