const { DatabaseError } = require("../../errorConfig");
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
  const existLocation = await checkLocation("name", locationName);
  if (!existLocation) return null;
  const locationInfo = {
    locationId: existLocaiton._id,
    locationName: existLocation.name,
  };
  return locationInfo;
};

const uniqueLocationName = async (locationName) => {
  const existLocation = await findLocationInfoByName(locationName);
  return existLocation === null;
};

exports.findLocationInfoByName = findLocationInfoByName;
exports.uniqueLocationName = uniqueLocationName;
