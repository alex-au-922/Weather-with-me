const express = require("express");
const {
  findLocationInfoByName,
  uniqueLocationName,
} = require("../../../generalUtils/location/locationName");
const { LocationNameError, ValueError } = require("../../../errorConfig");
const {
  updateLocation,
  latitudeCheck,
  longitudeCheck,
} = require("../../../databaseUtils/weatherDatabase/updateLocation");
const {
  addNewLocation,
} = require("../../../databaseUtils/weatherDatabase/addNewLocation");
const {
  getLatestData: getLatestWeatherData,
  getLatestGeoLocationData,
  geoLocationToWeather,
} = require("../../../databaseUtils/weatherDatabase/getLatestData");
const {
  deleteLocation,
  deleteWeatherWithLocationId,
} = require("../../../databaseUtils/weatherDatabase/deleteLocation");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const weatherResults = await getLatestWeatherData();
    const geolocationResults = await getLatestGeoLocationData();
    const newLatestWeatherData = geoLocationToWeather(
      geolocationResults,
      weatherResults
    );
    response.success = true;
    response.result = newLatestWeatherData;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const { oldName, newData } = req.body;
    const existLocation = await findLocationInfoByName(oldName);
    if (existLocation === null)
      throw new LocationNameError("Location to be updated not found!");
    const {
      name: newLocationName,
      latitude: newLocationLatitude,
      longitude: newLocationLongitude,
    } = newData;
    if (oldName !== newLocationName) {
      //check the new location name hasn't been taken
      const locationNameUnique = await uniqueLocationName(newLocationName);
      if (!locationNameUnique)
        throw new LocationNameError("Location already exists!");
    }
    const validLatitude = latitudeCheck(newLocationLatitude);
    if (!validLatitude) throw new ValueError("Invalid latitude!");
    const validLongitude = longitudeCheck(newLocationLongitude);
    if (!validLongitude) throw new ValueError("Invalid longitude!");
    const {locationId} = existLocation;
    await updateLocation(locationId, newData);
    response.success = true;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
}); //update location
router.post("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const newLocationData = req.body;
    const { name, latitude, longitude } = newLocationData;
    if (!name) throw new LocationNameError("Invalid location name!");
    const newLocationNameUnique = await uniqueLocationName(name);
    if (!newLocationNameUnique)
      throw new LocationNameError("Location already exists!");
    const validLatitude = latitudeCheck(latitude);
    if (!validLatitude) throw new ValueError("Invalid latitude!");
    const validLongitude = longitudeCheck(longitude);
    if (!validLongitude) throw new ValueError("Invalid longitude!");
    await addNewLocation(newLocationData);
    response.success = true;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
}); //create new location
router.delete("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const { name } = req.body;
    const existLocation = await findLocationInfoByName(name);
    if (existLocation === null)
      throw new LocationNameError("Location to be deleted not found!");
    const locationId = existLocation.locationId;
    await deleteWeatherWithLocationId(locationId);
    await deleteLocation(locationId);
    response.success = true;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
}); //delete location

module.exports = router;
