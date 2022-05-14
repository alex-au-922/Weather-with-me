//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const express = require("express");
const adminRoleCheck = require("../../middleware/resourceAuth/adminRoleCheck");
const usernameCheck = require("../../middleware/resourceAuth/usernameCheck");
const locationInfo = require("./locationInfo");
const userInfo = require("./userInfo");
const logInfo = require("./logInfo");
const weatherInfo = require("./refreshWeather");
const router = express.Router();

router.use("/", usernameCheck);
router.use("/", adminRoleCheck);
router.use("/locations", locationInfo);
router.use("/users", userInfo);
router.use("/logs", logInfo);
router.use("/weathers", weatherInfo);

module.exports = router;
