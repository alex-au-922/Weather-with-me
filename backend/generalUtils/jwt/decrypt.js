//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const jwt = require("jsonwebtoken");

const decrypt = (jsonWebToken) => {
  const result = jwt.verify(jsonWebToken, process.env.JWT_SECRET);
  return result;
};

exports.decrypt = decrypt;
