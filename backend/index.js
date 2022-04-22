const app = require("./generalUtils/createExpressApp").createExpressApp();
const logger = require("./generalUtils/getLogger").getLogger();
const db = require("./generalUtils/database").connectUserDB();
const api = require("./api/api");

api(app);

const server = app.listen(process.env.APP_PORT, () => {
  console.log(`Server is listening on port ${process.env.APP_PORT}`);
});
