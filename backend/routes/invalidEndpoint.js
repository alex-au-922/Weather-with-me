const express = require("express");
const { NotFoundError } = require("../errorConfig");
const router = express.Router();

router.use("/", async (req, res, next) => {
  try {
    throw new NotFoundError("Invalid method!");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
