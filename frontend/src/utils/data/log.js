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
