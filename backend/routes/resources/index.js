const express = require("express");
const router = express.Router();

const resourceAuthorizationCheck = require("../middleware/resourceAuth/accessTokenCheck");
const admin = require("./admin");
const user = require("./user");

router.use(resourceAuthorizationCheck); // all resources should be protected by access token
router.use("/admin/", admin);
router.use("/user", user);

module.exports = router;
