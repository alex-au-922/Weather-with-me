//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const express = require("express");
const usernameCheck = require("../../middleware/resourceAuth/usernameCheck");
const {
  checkUserCredentialsById,
  cleanUserData,
  findUserInfoByEmail,
} = require("../../../generalUtils/userCreds/username");
const {
  updateUser,
} = require("../../../databaseUtils/userDatabase/updateUser");
const { passwordHash } = require("../../../generalUtils/userCreds/password");
const { emitUserUpdate } = require("../../_emitEvent");
const {
  EmailError,
  UnauthorizationError,
  LocationNameError,
} = require("../../../errorConfig");
const {
  getUserFavouriteLocations,
} = require("../../../databaseUtils/userDatabase/getFavouriteLocations");
const {
  findLocationInfoByName,
} = require("../../../generalUtils/location/locationName");
const xss = require("xss");
const objectXss = require("../../../databaseUtils/xss");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const decryptedUserId = res.locals.decryptedUserId;
    const existsUser = await checkUserCredentialsById(decryptedUserId);
    if (existsUser === null)
      throw new UnauthorizationError("User unauthorized!");
    const cleantUser = cleanUserData(existsUser);
    response.success = true;
    response.result = cleantUser;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});

router.use(usernameCheck);
router.put("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const decryptedUserId = res.locals.decryptedUserId;
    const { password, viewMode, email, favouriteLocation } = req.body;
    let newUserInfo = {};
    if (password) {
      const hashedPassword = await passwordHash(password);
      newUserInfo.password = hashedPassword;
    }
    if (viewMode) newUserInfo.viewMode = viewMode;
    if (email) {
      const parsedEmail = xss(email);
      const existUser = await findUserInfoByEmail(parsedEmail);
      if (existUser !== null && existUser.userId !== decryptedUserId)
        throw new EmailError("Email already exists!");
      newUserInfo.email = email;
    }
    if (favouriteLocation) {
      const parsedFavouriteLocation = objectXss(favouriteLocation);
      const { name: amendedLocation, action } = parsedFavouriteLocation;
      const currentFavouriteLocations = await getUserFavouriteLocations(
        decryptedUserId
      );
      const existLocation = await findLocationInfoByName(amendedLocation);
      if (existLocation === null)
        throw new LocationNameError("Location doest not exist!");
      const { locationId } = existLocation;
      if (action === "add") {
        if (currentFavouriteLocations.indexOf(locationId) === -1)
          newUserInfo.favouriteLocation = [
            ...currentFavouriteLocations,
            locationId,
          ];
        else newUserInfo.favouriteLocation = currentFavouriteLocations;
      } else if (action === "delete") {
        newUserInfo.favouriteLocation = currentFavouriteLocations.filter(
          (currLocationId) =>
            locationId.toString() !== currLocationId._id.toString()
        );
      }
    }
    await updateUser(decryptedUserId, newUserInfo);
    response.success = true;
    res.send(JSON.stringify(response));
    await emitUserUpdate(decryptedUserId);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
