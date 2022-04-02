const mongoose = require("mongoose");
const logger = require("./getLogger").getLogger();

exports.connectWeatherDB = async function () {
  const databaseAdmin = process.env.DATABASE_ADMIN_USER;
  const databaseAdminPw = process.env.DATABASE_ADMIN_PASSWORD;
  const dbName = process.env.WEATHER_DATABASE_NAME;
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

exports.collectionExists = async function (db, collectionName) {
  const result = await db.db.listCollections().toArray();
  return result.some((collection) => collection.name === collectionName);
};
