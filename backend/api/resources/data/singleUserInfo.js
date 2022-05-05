const express = require("express");
const checkUserCredentialsById =
  require("../../../generalUtils/userCreds/username").checkUserCredentialsById;
const router = express.Router();

router.post("/", async (req, res, next) => {
  const response = res.locals.response;
  const decryptedUserId = res.locals.decryptedUserId;
  const existsUser = await checkUserCredentialsById(decryptedUserId);
  response.success = true;
  response.result = existsUser;
  next();
});

module.exports = router;
