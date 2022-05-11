const express = require("express");
const weatherInfo = require("./weatherInfo");
const userInfo = require("./userInfo");
const commentInfo = require("./commentInfo");
const router = express.Router();

router.use("/weathers", weatherInfo);
router.use("/user", userInfo);
router.use("/comment", commentInfo);

module.exports = router;
