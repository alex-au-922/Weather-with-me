const { DatabaseError } = require("../../errorConfig");
const { geolocationSchema, userSchema, locationCommentSchema } =
  require("../../backendConfig.js").databaseConfig;
const { ObjectId } = require("mongoose").Types;
const {
  connectWeatherDB,
  connectUserDB,
} = require("../../generalUtils/database");

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

const updateLocationComment = async (locationId, userId, message) => {
  try {
    const weatherDB = await connectWeatherDB();
    const GeoLocation = weatherDB.model("GeoLocation", geolocationSchema);
    const userDB = await connectUserDB();
    const User = userDB.model("User", userSchema);
    const LocationComment = weatherDB.model(
      "LocationComment",
      locationCommentSchema
    );
    const newComment = {
      userId,
      locationId,
      createTime: Date.now(),
      message,
    };
    await LocationComment.create(newComment);
    return true;
  } catch (error) {
    throw new DatabaseError(error);
  }
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
exports.updateLocationComment = updateLocationComment;
