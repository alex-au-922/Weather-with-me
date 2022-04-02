const app = require("./backendInit/createExpressApp").createExpressApp();
const logger = require("./generalUtils/getLogger").getLogger();

const server = app.listen(process.env.APP_PORT, () => {
  console.log(`Server is listening on port ${process.env.APP_PORT}`);
});
