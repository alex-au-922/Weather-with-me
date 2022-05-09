const { DatabaseError } = require("../../errorConfig");
const { geolocationSchema } = require("../../backendConfig.js").databaseConfig;
const { ObjectId } = require("mongoose").Types;
const { connectWeatherDB } = require("../../generalUtils/database");

const updateLocation = async (geolocationId, updateLocationInfo) => {
  const weatherDB = await connectWeatherDB();
  const GeoLocation = weatherDB.model("GeoLocation", geolocationSchema);
  const existsLocation = await GeoLocation.findById(geolocationId);
  if (existsLocation === null) throw new DatabaseError("No location record!");
  await UserModel.updateOne(
    { _id: ObjectId(geolocationId) },
    updateLocationInfo
  );
  return true;
};

exports.updateLocation = updateLocation;
