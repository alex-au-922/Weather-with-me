const app = require("./generalUtils/createExpressApp").createExpressApp();
const logger = require("./generalUtils/getLogger").getLogger();
const db = require("./generalUtils/database").connectUserDB();
const signup = require("./api/signup");
const login = require("./api/login");
const decrypt = require("./api/decrypt");

app.use("/signup", signup);
app.use("/login", login);
app.use("/decrypt", decrypt);

const server = app.listen(process.env.APP_PORT, () => {
  console.log(`Server is listening on port ${process.env.APP_PORT}`);
});
