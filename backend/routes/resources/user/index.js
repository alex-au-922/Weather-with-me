const express = require("express");
const weatherInfo = require("./weatherInfo");
const userInfo = require("./userInfo");
const router = express.Router();

router.use("/weathers", weatherInfo);
router.use("/user", userInfo);

module.exports = router;
