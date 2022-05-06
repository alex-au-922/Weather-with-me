const express = require("express");
const { PasswordError } = require("../../../errorConfig");
const {
  passwordHash,
  updatePassword,
} = require("../../../generalUtils/userCreds/password");
const getLatestUserData =
  require("../../../databaseUtils/userDatabase/getLatestData").getLatestData;
const adminRoleCheck = require("../../middleware/resourceAuth/adminRoleCheck");
const usernameCheck = require("../../middleware/resourceAuth/usernameCheck");
const router = express.Router();

router.use("/", usernameCheck);
router.use("/", adminRoleCheck);
router.post("/", async (req, res, next) => {
  const response = res.locals.response;
  const user = res.locals.user;
  const { password } = req.body;
  const userOldPasswordHash = user.password;
  const passwordSame = await comparePassword(password, userOldPasswordHash);
  if (passwordSame)
    throw new PasswordError("New password cannot be the same as old password!");
  const hashedPassword = await passwordHash(password);
  const userInfo = { username, password: hashedPassword };
  await updatePassword(userInfo);
  response.success = true;
  response.result = null;
  next();
});

module.exports = router;
