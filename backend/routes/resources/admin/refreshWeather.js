const express = require("express");
const router = express.Router();
const getLatestData =
  require("../../../databaseUtils/logDatabase/getLatestData").getLatestData;

router.get("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    await getLatestLogData();
    response.success = true;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
