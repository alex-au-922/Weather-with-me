//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const { HTTP_STATUS } = require("../../../backendConfig");

const initResponse = async (req, res, next) => {
  try {
    const response = {
      success: false,
      error: null,
      errorType: null,
      result: null,
    };
    res.locals.response = response;
    res.setHeader("Content-Type", "application/json");
    res.status(HTTP_STATUS.success.ok.status);
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = initResponse;
