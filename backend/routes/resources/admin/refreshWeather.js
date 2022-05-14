//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

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
