const { DatabaseError } = require("../../errorConfig");
const { geolocationSchema } = require("../../backendConfig.js").databaseConfig;
const { ObjectId } = require("mongoose").Types;
const { connectWeatherDB } = require("../../generalUtils/database");

const updateLocation = async (geolocationId, updateLocationInfo) => {
  const weatherDB = await connectWeatherDB();
  const GeoLocation = weatherDB.model("GeoLocation", geolocationSchema);
  const existsLocation = await GeoLocation.findById(geolocationId);
  if (existsLocation === null) throw new DatabaseError("No location record!");
  await GeoLocation.updateOne(
    { _id: ObjectId(geolocationId) },
    updateLocationInfo
  );
  return true;
};

const latitudeCheck = (latitude) => {
  // as input can be string, so we use == only
  return (
    latitude !== "" &&
    Number(latitude) == latitude &&
    latitude <= 90 &&
    latitude >= -90
  );
};

const longitudeCheck = (longitude) => {
  return (
    longitude !== "" &&
    Number(longitude) == longitude &&
    longitude <= 180 &&
    longitude >= -180
  );
};

exports.updateLocation = updateLocation;
exports.latitudeCheck = latitudeCheck;
exports.longitudeCheck = longitudeCheck;
