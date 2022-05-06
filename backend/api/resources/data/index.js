const express = require("express");
const router = express.Router();

const resourceAuthorizationCheck = require("../../middleware/resourceAuth/accessTokenCheck");
const allUserInfos = require("./allUsersInfo");
const singleUserInfo = require("./singleUserInfo");
const weatherInfos = require("./weatherInfo");

router.use(resourceAuthorizationCheck); // all resources should be protected by access token
router.use("/users", allUserInfos);
router.use("/user", singleUserInfo);
router.use("/weathers", weatherInfos);
module.exports = router;
