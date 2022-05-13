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

const router = express.Router();

// router.get("/:location", async (req, res, next) => {
//   const location = req.params;
//   const locId = findLocationInfoByName(location).locationId;
//   const response = res.locals.response;
//   try {
//     if (location === undefined) {
//       const weatherResults = await getLatestWeatherData();
//       const geolocationResults = await getLatestGeoLocationData();
//       const newLatestWeatherData = geoLocationToWeather(
//         geolocationResults,
//         weatherResults
//       );
//       response.success = true;
//       response.result = newLatestWeatherData;
//       res.send(JSON.stringify(response));
//     } else {
//       const backupWeatherResults = await getLatestBackupData(locId);
//       const geolocationResults = await getLatestGeoLocationData();
//       const newLatestBackupWeatherData = geoLocationToWeather(
//         geolocationResults,
//         backupWeatherResults
//       );
//       response.success = true;
//       response.result = newLatestBackupWeatherData;
//       res.send(JSON.stringify(response));
//     }
//   } catch (error) {
//     next(error);
//   }
// });

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
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
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
      const existUser = await findUserInfoByEmail(email);
      if (existUser !== null && existUser.userId !== decryptedUserId)
        throw new EmailError("Email already exists!");
      newUserInfo.email = email;
    }
    if (favouriteLocation) {
      const { name: amendedLocation, action } = favouriteLocation;
      const currentFavouriteLocations = await getUserFavouriteLocations(
        decryptedUserId
      );
      const existLocation = await findLocationInfoByName(amendedLocation);
      if (existLocation === null)
        throw new LocationNameError("Location doest not exist!");
      const { locationId } = existLocation;
      if (action === "add") {
        newUserInfo.favouriteLocation = [
          ...currentFavouriteLocations,
          locationId,
        ];
      } else if (action === "delete") {
        newUserInfo.favouriteLocation = currentFavouriteLocations.filter(
          (currLocationId) =>
            locationId.toString() !== currLocationId._id.toString()
        );
      }
    }
    await updateUser(decryptedUserId, newUserInfo);
    emitUserUpdate(ip);
    response.success = true;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
