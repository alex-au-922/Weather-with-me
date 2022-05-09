const express = require("express");
const { EmailError } = require("../errorConfig");
const { findUserInfoByEmail } =
  require("../generalUtils/userCreds/username");
const randomString = require("../generalUtils/randomString").randomString;
const {
  sendResetPwEmail,
  userHash,
} = require("../generalUtils/userCreds/resetPw");
const addPendingResetPwUser =
  require("../databaseUtils/userDatabase/resetPw").addPendingResetPwUser;
const resetLinkExpiredTime = require("../backendConfig").resetLinkExpiredTime;
const offsetTime = require("../generalUtils/time/offsetTime").offsetTime;
const { passwordHash } = require("../generalUtils/userCreds/password");
const { updateUser } = require("../databaseUtils/userDatabase/updateUser");
const userHashCheck = require("./middleware/resourceAuth/userHashCheck");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const { email } = req.body;
    const existUser = await findUserInfoByEmail(email);
    if (existUser === null)
      throw new EmailError("User does not exist!");
    const { userId, username } = existUser;
    const randomUserString = randomString(12);
    const userHashString = await userHash(randomUserString);
    const resetPwInfo = {
      userId,
      userHash: userHashString,
      email,
      username,
      createdTime: offsetTime(0),
      expiredTime: offsetTime(resetLinkExpiredTime),
    };
    await addPendingResetPwUser(resetPwInfo);
    await sendResetPwEmail(resetPwInfo);
    response.success = true;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});

router.use(userHashCheck);
router.get("/:userHash", async (req, res, next) => {
  try {
    const response = res.locals.response;
    response.success = true;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});

router.put("/:userHash", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const decryptedUserId = res.locals.decryptedUserId;
    const { password } = req.body;
    const hashedPassword = await passwordHash(password);
    const newUserInfo = {
      password: hashedPassword,
    };
    await updateUser(decryptedUserId, newUserInfo);
    response.success = true;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
