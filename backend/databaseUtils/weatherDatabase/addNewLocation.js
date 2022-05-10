const { DatabaseError } = require("../../errorConfig");
const {geolocationSchema }= require("../../backendConfig.js").databaseConfig;
const {connectWeatherDB} = require("../../generalUtils/database");

const addNewLocation = async (newLocation) => {
  try {
    const weatherDB= await connectWeatherDB();
    const GeoLocation = weatherDB.model("GeoLocation", geolocationSchema);
    const result = await GeoLocation.create(newLocation);
    return result._id;
  } catch (error) {
    throw new DatabaseError("Cannot create new location to database!");
  }
};

exports.addNewLocation = addNewLocation;
