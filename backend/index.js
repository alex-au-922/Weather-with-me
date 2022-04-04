const app = require("./backendInit/createExpressApp").createExpressApp();
const logger = require("./generalUtils/getLogger").getLogger();

app.get("/*", (req, res) => res.send("Hello from the backend"));

app.post("/login", (req, res) => {
  logger.info("Login request received");
  res.setHeader("Content-Type", "application/json");
  res.send({ success: "Login request received" });
});

const server = app.listen(process.env.APP_PORT, () => {
  console.log(`Server is listening on port ${process.env.APP_PORT}`);
});
