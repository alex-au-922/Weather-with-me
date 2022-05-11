const express = require("express");
const router = express.Router();
const getLatestLogData =
  require("../../../databaseUtils/logDatabase/getLatestLogData").getLatestLogData;

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
