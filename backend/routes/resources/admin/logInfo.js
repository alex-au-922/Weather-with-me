//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const express = require("express");
const router = express.Router();
const getLatestLogData =
  require("../../../databaseUtils/logDatabase/getLatestData").getLatestData;

router.get("/", async (req, res, next) => {
  try {
    const response = res.locals.response;
    const result = await getLatestLogData();
    console.log("result", result);
    response.success = true;
    response.result = result;
    res.send(JSON.stringify(response));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
