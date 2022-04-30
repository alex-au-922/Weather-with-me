const express = require("express");
const router = express.Router();
const checkUserCredentialsById =
  require("../../generalUtils/userCreds/username").checkUserCredentialsById;
const decrypt = require("../../generalUtils/jwt/decrypt").decrypt;
router.post("/", async (req, res) => {
  const { token } = req.body;

  res.setHeader("Content-Type", "application/json");
  try {
    const decoded = decrypt(token);
    const { success, user } = await checkUserCredentialsById(decoded._id);
    if (success) {
      const result = {
        username: user.username,
        role: user.role,
        viewMode: user.viewMode,
        email: user.email,
        exp: decoded.exp,
      };
      res.send({ success: true, result });
    } else {
      res.send({ success: false, result: null });
    }
  } catch (error) {
    res.send({ success: false, error });
  }
});

module.exports = router;
