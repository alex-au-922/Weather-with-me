const express = require("express");
const { MethodNotAllowedError } = require("../errorConfig");
const router = express.Router();

router.use("/", async (req, res, next) => {
  try {
    throw new MethodNotAllowedError("Invalid method!");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
