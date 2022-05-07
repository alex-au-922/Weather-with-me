const express = require("express");
const getLatestUserData =
  require("../../../databaseUtils/userDatabase/getLatestData").getLatestData;
const router = express.Router();

router.get("/", async (req, res, next) => {
  const response = res.locals.response;
  const result = await getLatestUserData();
  response.success = true;
  response.result = result;
  res.send(JSON.stringify(response));
});
router.put("/", async (req, res, next) => {}); //update existsing user
router.post("/", async (req, res, next) => {}); //create new user
router.delete("/", async (req, res, next) => {}); //delete user

module.exports = router;
