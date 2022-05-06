const express = require("express");
const getLatestUserData =
  require("../../../databaseUtils/userDatabase/getLatestData").getLatestData;
const adminRoleCheck = require("../../middleware/resourceAuth/adminRoleCheck");
const usernameCheck = require("../../middleware/resourceAuth/usernameCheck");
const router = express.Router();

router.use("/", usernameCheck);
router.use("/", adminRoleCheck);
router.post("/", async (req, res, next) => {
  const response = res.locals.response;
  const result = await getLatestUserData();
  response.success = true;
  response.result = result;
  next();
});

module.exports = router;
