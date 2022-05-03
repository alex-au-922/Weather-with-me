const express = require("express");
const findUserInfoByEmail =
  require("../../generalUtils/userCreds/username").findUserInfoByEmail;
const randomHash = require("../../generalUtils/userCreds/userHash").randomHash;
const sendResetPwEmail =
  require("../../generalUtils/userCreds/resetPwEmail").sendResetPwEmail;
const addPendingResetPwUser =
  require("../../databaseUtils/userDatabase/resetPw").addPendingResetPwUser;
const resetLinkExpiredTime =
  require("../../backendConfig").resetLinkExpiredTime;
const offsetTime = require("../../generalUtils/time/offsetTime").offsetTime;
const router = express.Router();

router.post("/", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { email } = req.body;
  res.send({ success: true, error: null });
  const existUser = await findUserInfoByEmail(email);

  if (existUser !== null) {
    const { userId, username } = existUser;
    const userHash = randomHash();
    const resetPwInfo = {
      userId,
      userHash,
      email,
      username,
      expiredTime: offsetTime(resetLinkExpiredTime),
    };
    const addPendingResult = await addPendingResetPwUser(resetPwInfo);
    if (addPendingResult.success) {
      await sendResetPwEmail(resetPwInfo);
    }
  }
});

module.exports = router;
