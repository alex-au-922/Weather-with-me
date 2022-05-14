//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const express = require("express");
const { HTTP_STATUS } = require("../../../backendConfig");
const {
  UsernameError,
  UnauthorizationError,
  EmailError,
} = require("../../../errorConfig");
const { passwordHash } = require("../../../generalUtils/userCreds/password");
const {
  findUserInfoByUsername,
  findUserInfoByEmail,
  uniqueUsername,
} = require("../../../generalUtils/userCreds/username");
const {
  updateUser,
} = require("../../../databaseUtils/userDatabase/updateUser");
const {
  deleteUser,
} = require("../../../databaseUtils/userDatabase/deleteUser");
const getLatestUserData =
  require("../../../databaseUtils/userDatabase/getLatestData").getLatestData;
const {
  emitUserUpdate,
  emitDeleteUser,
  emitCommentUpdate,
} = require("../../_emitEvent");
const xss = require("xss");
const {
  deleteComment,
} = require("../../../databaseUtils/weatherDatabase/updateLocation");
const objectXss = require("../../../databaseUtils/xss");
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
    const { oldUsername, newData } = req.body;
    const parsedOldUsername = xss(oldUsername);
    const parsedNewData = objectXss(newData);
    const { userId } = await findUserInfoByUsername(parsedOldUsername);
    const {
      username: newUsername,
      password: newPassword,
      email: newEmail,
      viewMode: newViewMode,
    } = parsedNewData;

    let newUserInfo = {};
    if (oldUsername !== newUsername) {
      // check the new username hasn't been taken
      const usernameUnique = await uniqueUsername(newUsername);
      if (!usernameUnique) throw new UsernameError("Username already exists!");
    }
    newUserInfo.username = newUsername;

    if (newEmail) {
      const existsEmail = await findUserInfoByEmail(newEmail);
      if (
        existsEmail !== null &&
        existsEmail.userId.toString() !== userId.toString()
      )
        throw new EmailError("Email already exists!");
      newUserInfo.email = newEmail;
    }

    if (newPassword) {
      //hash the password if the password has been changed
      const hashedPassword = await passwordHash(newPassword);
      newUserInfo.password = hashedPassword;
    }

    newUserInfo.viewMode = newViewMode;
    await updateUser(userId, newUserInfo);
    response.success = true;
    res.send(JSON.stringify(response));
    await emitUserUpdate(userId);
    await emitCommentUpdate();
  } catch (error) {
    next(error);
  }
}); //update existsing user

router.post("/", async (req, res, next) => {
  try {
    res.redirect(307, "../../signup");
  } catch (error) {
    next(error);
  }
}); //create new user === signup

router.delete("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const { username } = req.body;
    const parsedUsername = xss(username);
    const existsUser = await findUserInfoByUsername(parsedUsername);
    if (existsUser === null) throw UnauthorizationError("Unauthorized Action!");
    const userId = existsUser.userId;
    await deleteUser(userId);
    await deleteComment(null, userId);
    response.success = true;
    res.status(HTTP_STATUS.success.ok.status);
    res.send(JSON.stringify(response));
    await emitDeleteUser(userId);
    await emitCommentUpdate();
  } catch (error) {
    next(error);
  }
}); //delete user

module.exports = router;
