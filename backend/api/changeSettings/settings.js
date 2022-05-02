const express = require("express");
const router = express.Router();
const logger = require("../../generalUtils/getLogger").getLogger();
const decrypt = require("../../generalUtils/jwt/decrypt").decrypt;
const updateUserData =
  require("../../databaseUtils/userDatabase/updateSettings").updateUserData;
const eventEmitter = require("../_eventEmitter");
const checkUserCredentialsById = require("../../generalUtils/userCreds/username").checkUserCredentialsById;


router.post("/", async (req, res) => {
  const { token, username, email, viewMode } = req.body;
  if (token !== undefined && token !== null) {
    try {
      const decoded = decrypt(token);
      const { user } = await checkUserCredentialsById(decoded._id);
      if (user.username === username) {
        const newUserInfo = { email, viewMode };
        const result = await updateUserData(username, newUserInfo);
        res.send({
          success: result.success,
          errorType: result.success ? null : "unknown",
          error: result.error,
        });
        eventEmitter.emit("updateUserData");
      } else {
        res.send({
          success: false,
          errorType: "unauthorized",
          error: "Unauthorized action",
        });
      }
    } catch (error) {
      logger.error(error);
      res.send({
        success: false,
        errorType: "unauthorized",
        error: "Unauthorized action",
      });
    }
  } else {
    res.send({
      success: false,
      errorType: "unauthorized",
      error: "Unauthorized action",
    });
  }
});

module.exports = router;
