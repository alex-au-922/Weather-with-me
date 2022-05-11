const express = require("express");
const xss = require("xss");
const {
  updateLocationComment,
  getLocationComment,
} = require("../../../databaseUtils/weatherDatabase/updateLocation");
const { LocationNameError } = require("../../../errorConfig");
const {
  findLocationInfoByName,
} = require("../../../generalUtils/location/locationName");
const usernameCheck = require("../../middleware/resourceAuth/usernameCheck");

const router = express.Router();

router.use(usernameCheck);
router.post("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const decryptedUserId = res.locals.decryptedUserId;
    const { name: locationName, comment } = req.body;
    const existsLocation = await findLocationInfoByName(locationName);
    if (existsLocation === null)
      throw new LocationNameError("Location does not exist!");
    const { locationId } = existsLocation;
    const parsedComment = xss(comment);
    await updateLocationComment(locationId, decryptedUserId, parsedComment);
    response.success = true;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const decryptedUserId = res.locals.decryptedUserId;
    response.success = true;
    response.result = await getLocationComment();
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
