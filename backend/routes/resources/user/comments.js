const express = require("express");
const xss = require()
const usernameCheck = require("../../middleware/resourceAuth/usernameCheck");
const {
  updateUser,
} = require("../../../databaseUtils/userDatabase/updateUser");
const {
  findLocationInfoByName,
} = require("../../../generalUtils/location/locationName");

const router = express.Router();

router.use(usernameCheck);
router.post("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const decryptedUserId = res.locals.decryptedUserId;
    const { name: locationName, comment } = req.body;
      const locationInfo = await findLocationInfoByName(locationName);
      
    await updateUser(decryptedUserId, newUserInfo);
    response.success = true;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
