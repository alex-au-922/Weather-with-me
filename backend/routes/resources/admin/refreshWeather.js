const express = require("express");
const { emitCrawlLatestWeather } = require("../../_emitEvent");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    response.success = true;
    res.send(JSON.stringify(response));
    await emitCrawlLatestWeather();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
