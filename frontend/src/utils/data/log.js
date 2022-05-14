//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import convertISOToDateTimeString from "../time/convertISOToDateTimeString";

const parseLogDataFrontendView = (LogJson) => {
  const newLogObject = LogJson.map((obj) => {
    const newLogObject = {};
    newLogObject["_id"] = obj._id;
    newLogObject["method"] = obj.method;
    newLogObject["userAgent"] = obj.userAgent;
    newLogObject["date"] = convertISOToDateTimeString(obj.date);
    newLogObject["ip"] = obj.ip;
    newLogObject["api"] = obj.api;
    return newLogObject;
  });
  return newLogObject;
};

export default parseLogDataFrontendView;
