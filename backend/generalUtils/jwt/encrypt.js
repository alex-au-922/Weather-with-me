//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const jwt = require("jsonwebtoken");

const encrypt = (jwtStore, expireTimeString) => {
  const token = jwt.sign(jwtStore, process.env.JWT_SECRET, {
    expiresIn: expireTimeString,
  });
  return token;
};

exports.encrypt = encrypt;
