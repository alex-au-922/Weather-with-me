//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

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
  console.log(existsWeatherData);
  if (existsWeatherData === null) return true;
  await Weather.deleteMany({ locationId: ObjectId(geolocationId) });
  return true;
};

exports.deleteLocation = deleteLocation;
exports.deleteWeatherWithLocationId = deleteWeatherWithLocationId;
