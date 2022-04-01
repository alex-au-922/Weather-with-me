const mongoose = require("mongoose");

exports.connectDB = function () {
  const databaseURL = process.env.DATABASE_ACCESS_URL;

  mongoose.connect(databaseURL);
  return mongoose.connection;
};
