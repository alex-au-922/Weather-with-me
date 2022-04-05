const jwt = require("jsonwebtoken");

const encrypt = (id) => {
  const token = jwt.sign({ _id: id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7 day",
  });
  return token;
};

exports.encrypt = encrypt;
