//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

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
