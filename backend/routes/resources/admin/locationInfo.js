const express = require("express");
const {
  findLocationInfoByName,
  uniqueLocationName,
} = require("../../../generalUtils/location/locationName");
const { eventEmitter } = require("../../_emitEvent");
const router = express.Router();

router.put("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const { oldName, newData } = req.body;
    const { locationId } = await findLocationInfoByName(oldName);
    const { name: newLocationName } = newData;
    if (oldName !== newLocationName) {
      //check the new location name hasn't been taken
      const locationNameUnique = await uniqueLocationName(newLocationName);
      if (!locationNameUnique)
        throw new LocationNameError("Location name already exists!");
    }
    await updateLocation(locationId, newData);
    response.success = true;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
}); //update location
router.post("/", async (req, res, next) => {}); //create new location
router.delete("/", async (req, res, next) => {}); //delete location

module.exports = router;
