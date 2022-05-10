const express = require("express");
const router = express.Router();

const signup = require("./signup");
const login = require("./login");
const resources = require("./resources");
const resetPw = require("./resetPw");
const invalidEndpoint = require("./invalidEndpoint");
const refreshToken = require("./token/refresh");
const initResponse = require("./middleware/general/initResponse");
const errorHandler = require("./middleware/general/errorHandler");
const errorLogger = require("./middleware/general/errorLogger");
const allowCors = require("./middleware/general/allowCors");
const requestLog = require("./middleware/general/requestLog");

router.use(allowCors);
router.use(requestLog);
router.use(initResponse);
router.use("/signup", signup);
router.use("/token/refresh", refreshToken);
router.use("/login", login);
router.use("/resetpw", resetPw);
router.use("/resources", resources);
router.use("/", invalidEndpoint);
router.use(errorLogger);
router.use(errorHandler);

module.exports = router;
