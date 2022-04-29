const express = require("express");
const { encrypt } = require("../../generalUtils/jwt/encrypt");
const passwordUtils = require("../../generalUtils/userCreds/password");
const {
  checkUserCredentials,
} = require("../../generalUtils/userCreds/username");
const passwordHash = passwordUtils.passwordHash;
const updatePassword = passwordUtils.updatePassword;
const comparePassword = passwordUtils.comparePassword;
const logger = require("../../generalUtils/getLogger").getLogger();

const router = express.Router();

router.post("/", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { username, password } = req.body;
  const { user } = await checkUserCredentials("username", username);
  const passwordSame = await comparePassword(password, user.password);
  if (passwordSame) {
    logger.info(`User ${username} has typed the same password.`);
    res.send({
      success: false,
      errorType: "password",
      error: "New password cannot be the same as old password!",
    });
  } else {
    const hashedPassword = await passwordHash(password);
    const userInfo = { username, password: hashedPassword };
    const result = await updatePassword(userInfo);
    if (result.success) {
      const { success, errorType, error } = result;
      const token = encrypt(user._id);
      res.send({ success, errorType, error, token });
    } else {
      res.send(result);
    }
  }
});

module.exports = router;
