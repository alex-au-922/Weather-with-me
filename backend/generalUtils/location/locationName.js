//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const { DatabaseError, LocationNameError } = require("../../errorConfig");
const { connectWeatherDB } = require("../database");
const { geolocationSchema } = require("../../backendConfig.js").databaseConfig;

const checkLocation = async (key, value) => {
  try {
    const weatherDB = await connectWeatherDB();
    const GeoLocation = weatherDB.model("GeoLocation", geolocationSchema);
    const query = { [key]: value };
    const geolocationDoc = await GeoLocation.findOne(query);
    const geolocation =
      geolocationDoc === null ? null : geolocationDoc.toObject();
    return geolocation;
  } catch (error) {
    throw new DatabaseError(error);
  }
};

const checkLocationById = async (locationId) => {
  try {
    const weatherDB = await connectWeatherDB();
    const GeoLocation = weatherDB.model("GeoLocation", geolocationSchema);
    const foundLocation = await GeoLocation.findById(locationId);
    if (foundLocation === null) return null;
    const location = foundLocation.toObject();
    return location;
  } catch (error) {
    throw new DatabaseError(error);
  }
};

const findLocationInfoByName = async (locationName) => {
  try {
    const existLocation = await checkLocation("name", locationName);
    if (!existLocation) return null;
    const locationInfo = {
      locationId: existLocation._id,
      locationName: existLocation.name,
    };
    return locationInfo;
  } catch (error) {
    throw new DatabaseError(error);
  }
};

const uniqueLocationName = async (locationName) => {
  const existLocation = await findLocationInfoByName(locationName);
  return existLocation === null;
};

exports.findLocationInfoByName = findLocationInfoByName;
exports.uniqueLocationName = uniqueLocationName;
