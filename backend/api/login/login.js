const express = require("express");
const router = express.Router();
const logger = require("../../generalUtils/getLogger").getLogger();
const encrypt = require("../../generalUtils/jwt/encrypt").encrypt;
const comparePassword =
  require("../../generalUtils/userCreds/password").comparePassword;
const checkUserCredentials =
  require("../../generalUtils/userCreds/username").checkUserCredentials;

router.post("/", (req, res) => {
  const { username, password } = req.body;

  const handleLogin = async () => {
    res.setHeader("Content-Type", "application/json");
    const userInfo = await checkUserCredentials("username", username);
    if (!userInfo.success)
      res.send({ success: false, errorType: null, error: null });

    if (userInfo.user === null) {
      logger.warn(`No user ${username}`);
      res.send({
        success: false,
        errorType: "username",
        error: "Account doesn't exist!",
      });
    } else {
      const passwordCorrect = await comparePassword(
        password,
        userInfo.user.password
      );
      if (passwordCorrect) {
        logger.info(`User ${username} is logged in`);
        const token = encrypt(userInfo.user._id);
        res.send({
          success: true,
          errorType: null,
          error: null,
          token,
        });
      } else {
        logger.warn(`Incorrect password for user ${username}`);
        res.send({
          success: false,
          errorType: "password",
          error: "Password incorrect!",
        });
      }
    }
  };
  handleLogin();
});

module.exports = router;
