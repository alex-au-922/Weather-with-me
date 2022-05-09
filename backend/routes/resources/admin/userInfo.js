const express = require("express");
const { HTTP_STATUS } = require("../../../backendConfig");
const { UsernameError, UnauthorizationError } = require("../../../errorConfig");
const { passwordHash } = require("../../../generalUtils/userCreds/password");
const {
  findUserInfoByUsername,
  uniqueUsername,
} = require("../../../generalUtils/userCreds/username");
const {
  deleteUser,
} = require("../../../databaseUtils/userDatabase/deleteUser");
const getLatestUserData =
  require("../../../databaseUtils/userDatabase/getLatestData").getLatestData;
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const result = await getLatestUserData();
    response.success = true;
    response.result = result;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});
router.put("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const { oldData, newData } = req.body;
    const { oldUsername } = oldData;
    const { userId } = findUserInfoByUsername(oldUsername);
    const {
      username: newUsername,
      password: newPassword,
      email: newEmail,
      viewMode: newViewMode,
    } = newData;

    let newUserInfo = {};
    if (oldUsername !== newUsername) {
      // check the new username hasn't been taken
      const usernameUnique = await uniqueUsername(newUsername);
      if (!usernameUnique) throw new UsernameError("Username already exists!");
    }
    newUserInfo.username = newUsername;

    const existsEmail = await findUserInfoByEmail(newEmail);
    if (existsEmail !== null && existsEmail.userId !== userId)
      throw new EmailError("Email already exists!");
    newUserInfo.email = newEmail;

    if (newPassword) {
      //hash the password if the password has been changed
      const hashedPassword = await passwordHash(newPassword);
      newUserInfo.password = hashedPassword;
    }

    newUserInfo.viewMode = newViewMode;
    await updateUser(userId, newUserInfo);
    response.success = true;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
}); //update existsing user

router.post("/", async (req, res, next) => {
  try {
    res.redirect("../../signup");
  } catch (error) {
    next(error);
  }
}); //create new user

router.delete("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const { username } = req.body;
    const existsUser = await findUserInfoByUsername(username);
    if (existsUser === null) throw UnauthorizationError("Unauthorized Action!");
    const userId = existsUser.userId;
    // await deleteUser(userId);
    response.success = true;
    res.status(HTTP_STATUS.success.ok.status);
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
}); //delete user

module.exports = router;
