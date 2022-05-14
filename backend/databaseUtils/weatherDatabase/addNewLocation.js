//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

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
