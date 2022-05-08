const express = require("express");
const usernameCheck = require("../../middleware/resourceAuth/usernameCheck");
const checkUserCredentialsById =
  require("../../../generalUtils/userCreds/username").checkUserCredentialsById;
const router = express.Router();

router.get("/", async (req, res, next) => {
  const response = res.locals.response;
  const decryptedUserId = res.locals.decryptedUserId;
  const existsUser = await checkUserCredentialsById(decryptedUserId);
  response.success = true;
  response.result = existsUser;
  res.send(JSON.stringify(response));
});

router.put(usernameCheck);
router.put("/", async (req, res, next) => {
  const response = res.locals.response;
  const decryptedUserId = res.locals.decryptedUserId;
  next();
});

module.exports = router;
