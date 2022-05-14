const { DatabaseError } = require("../../errorConfig");
const { geolocationSchema, weatherSchema } =
  require("../../backendConfig.js").databaseConfig;
const { ObjectId } = require("mongoose").Types;
const { connectWeatherDB } = require("../../generalUtils/database");

const deleteLocation = async (geolocationId) => {
  const weatherDB = await connectWeatherDB();
  const GeoLocation = weatherDB.model("GeoLocation", geolocationSchema);
  const existsLocation = await GeoLocation.findById(geolocationId);
  if (existsLocation === null) throw new DatabaseError("No location record!");
  await GeoLocation.deleteOne({ _id: ObjectId(geolocationId) });
  return true;
};

const deleteWeatherWithLocationId = async (geolocationId) => {
  const weatherDB = await connectWeatherDB();
  const Weather = weatherDB.model("Weather", weatherSchema);
  const existsWeatherData = await Weather.findOne({
    locationId: ObjectId(geolocationId),
  });
  if (existsWeatherData === null) return true;
  await Weather.deleteMany({ locationId: ObjectId(geolocationId) });
  return true;
};

exports.deleteLocation = deleteLocation;
exports.deleteWeatherWithLocationId = deleteWeatherWithLocationId;
