const express = require("express");
const adminRoleCheck = require("../../middleware/resourceAuth/adminRoleCheck");
const usernameCheck = require("../../middleware/resourceAuth/usernameCheck");
const locationInfo = require("./locationInfo");
const userInfo = require("./userInfo");
const router = express.Router();

router.use("/", usernameCheck);
router.use("/", adminRoleCheck);
router.use("/locations", locationInfo);
router.use("/users", userInfo);

module.exports = router;
