const { DatabaseError } = require("../../errorConfig");
const {
  connectUserDB,
  connectWeatherDB,
} = require("../../generalUtils/database");
const logger = require("../../generalUtils/getLogger").getLogger();
const { userSchema, geolocationSchema } =
  require("../../backendConfig.js").databaseConfig;

const getLatestData = async () => {
  try {
    const userDB = await connectUserDB();
    const User = userDB.model("User", userSchema);
    const weatherDB = await connectWeatherDB();
    const GeoLocation = weatherDB.model("GeoLocation", geolocationSchema);
    const result = await User.find().populate(
      "favouriteLocation",
      "",
      GeoLocation
    );
    return result;
  } catch (error) {
    throw new DatabaseError(error);
  }
};

exports.getLatestData = getLatestData;
