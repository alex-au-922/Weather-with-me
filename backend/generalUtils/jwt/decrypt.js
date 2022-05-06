const jwt = require("jsonwebtoken");

const decrypt = (jsonWebToken) => {
  const result = jwt.verify(jsonWebToken, process.env.JWT_SECRET);
  return result;
};

exports.decrypt = decrypt;
