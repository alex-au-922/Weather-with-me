const express = require("express");
const router = express.Router();
const uniqueUsername =
  require("../../generalUtils/userCreds/username").uniqueUsername;
const addNewUser =
  require("../../databaseUtils/userDatabase/addNewUser").addNewUser;
const passwordHash =
  require("../../generalUtils/userCreds/password").passwordHash;
const encrypt = require("../../generalUtils/jwt/encrypt").encrypt;
const eventEmitter = require("../_eventEmitter");

router.post("/", (req, res) => {
  const { username, password, email } = req.body;
  const handleSignup = async () => {
    res.setHeader("Content-Type", "application/json");
    const newUsernameUnique = await uniqueUsername(username);
    if (!newUsernameUnique) {
      res.send({
        success: false,
        errorType: "username",
        error: "Username already exists",
      });
    } else {
      const hashedPassword = await passwordHash(password);
      const newUser = {
        username: username,
        password: hashedPassword,
        email: email,
        role: "user",
        viewMode: "default",
      };
      const userId = await addNewUser(newUser);
      const token = encrypt(userId);
      res.send({ success: true, errorType: null, error: null, token });
      eventEmitter.emit("updateUserData");
    }
  };
  handleSignup();
});

module.exports = router;
