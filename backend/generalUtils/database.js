//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const mongoose = require("mongoose");

let weatherDB = null;
let userDB = null;
let loggerDB = null;

exports.connectWeatherDB = async () =>
  await connectDB(weatherDB, process.env.WEATHER_DATABASE_NAME);

exports.connectUserDB = async () =>
  await connectDB(userDB, process.env.USER_DATABASE_NAME);

exports.connectLoggerDB = async () =>
  await connectDB(loggerDB, process.env.LOGGER_DATABASE_NAME);

exports.collectionExists = async (db, collectionName) => {
  const result = await db.db.listCollections().toArray();
  return result.some((collection) => collection.name === collectionName);
};

const connectDB = async (existDB, dbName) => {
  if (existDB !== null) return existDB;
  const databaseAdmin = process.env.DATABASE_ADMIN_USER;
  const databaseAdminPw = process.env.DATABASE_ADMIN_PASSWORD;
  const databaseHost = process.env.DATABASE_HOST;
  const databasePort = process.env.DATABASE_PORT;
  const databaseURL = `mongodb://${databaseHost}:${databasePort}/`;
  const connectionOption = {
    user: databaseAdmin,
    pass: databaseAdminPw,
    dbName: dbName,
  };
  await mongoose.connect(databaseURL, connectionOption);
  existDB = mongoose.connection.useDb(dbName);
  existDB.on("error", (error) => logger.error(error));
  existDB.on("open", () => logger.info(`Connected to database ${dbName}`));
  existDB.on("close", () =>
    logger.info(`Closed the database ${dbName} connection`)
  );
  return existDB;
};
