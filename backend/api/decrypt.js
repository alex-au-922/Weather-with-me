const express = require("express");
const router = express.Router();
const checkUserCredentialsById =
  require("../generalUtils/userCreds/username").checkUserCredentialsById;
const decrypt = require("../generalUtils/jwt/decrypt").decrypt;
router.post("/", (req, res) => {
  const { token } = req.body;

  const handleDecryptToken = async () => {
    res.setHeader("Content-Type", "application/json");
    const decoded = decrypt(token);

    const { success, user } = await checkUserCredentialsById(decoded._id);
    const result = {
      username: user.username,
      role: user.role,
      viewMode: user.viewMode,
      email: user.email,
      exp: decoded.exp,
    };
    res.send({ success: true, result });
  };
  handleDecryptToken();
});

module.exports = router;
