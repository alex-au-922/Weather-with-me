const jwt = require("jsonwebtoken");

const encrypt = (jwtStore, expireTimeString) => {
  const token = jwt.sign(jwtStore, process.env.JWT_SECRET, {
    expiresIn: expireTimeString,
  });
  return token;
};

exports.encrypt = encrypt;
