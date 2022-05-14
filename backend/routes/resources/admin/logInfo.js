const express = require("express");
const router = express.Router();
const getLatestLogData =
  require("../../../databaseUtils/logDatabase/getLatestData").getLatestData;

router.get("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const result = await getLatestLogData();
    response.success = true;
    response.result = result;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
