const decrypt = require("../../generalUtils/jwt/decrypt").decrypt;
const express = require("express");
const checkUserCredentialsById =
  require("../../generalUtils/userCreds/username").checkUserCredentialsById;
const getLatestUserData =
  require("../../databaseUtils/userDatabase/getLatestData").getLatestData;
const router = express.Router();

router.post("/", async (req, res) => {
  const { token, username } = req.body;
  if (token !== undefined && token !== null) {
    try {
      const decoded = decrypt(token);
      const { user } = await checkUserCredentialsById(decoded._id);
      if (user.role === "admin" && username === user.username) {
        const result = await getLatestUserData();
        res.send({
          success: result.success,
          errorType: result.success ? null : "unknown",
          error: result.error,
          result: result.result,
        });
      } else {
        res.send({
          success: false,
          errorType: "unauthorized",
          error: "Please don't try to hack me!",
        });
      }
    } catch (error) {
      // if decryption error, say the token is corrupted
      res.send({
        success: false,
        errorType: "unauthorized",
        error,
      });
    }
  } else {
    res.send({
      success: false,
      errorType: "unauthorized",
      error: "Please don't try to hack me!",
    });
  }
});

module.exports = router;
