const express = require("express");
const checkUserHash =
  require("../../databaseUtils/userDatabase/checkUserHash").checkUserHash;
const logger = require("../../generalUtils/getLogger").getLogger();
const router = express.Router();

router.post("/", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { userHash } = req.body;
  try {
    const userInfo = await checkUserHash(userHash);
    if (userInfo === null) {
      logger.warn(`The hash ${userHash} does not exist!`);
      res.send({ success: true, error: null, userInfo: null });
    } else {
      res.send({ success: true, error: null, userInfo });
    }
  } catch (error) {
    logger.error(error);
    res.send({ success: false, error, userInfo: null });
  }
});

module.exports = router;
