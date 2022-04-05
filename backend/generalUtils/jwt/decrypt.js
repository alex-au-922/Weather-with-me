const jwt = require("jsonwebtoken");

const decrypt = (token) => {
  const result = jwt.verify(token, process.env.JWT_SECRET);
  return result;
};

exports.decrypt = decrypt;
