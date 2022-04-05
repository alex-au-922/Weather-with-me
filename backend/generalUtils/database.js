const mongoose = require("mongoose");
const logger = require("./getLogger").getLogger();

exports.connectWeatherDB = async () =>
  await connectDB(process.env.WEATHER_DATABASE_NAME);

exports.connectUserDB = async () =>
  await connectDB(process.env.USER_DATABASE_NAME);

exports.collectionExists = async (db, collectionName) => {
  const result = await db.db.listCollections().toArray();
  return result.some((collection) => collection.name === collectionName);
};

const connectDB = async (dbName) => {
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
  const db = mongoose.connection;
  db.on("error", (error) => logger.error(error));
  db.on("open", () => logger.info("Connected to database"));
  db.on("close", () => logger.info("Closed the database connection"));
  return db;
};
