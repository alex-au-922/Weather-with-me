//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import convertISOToDateTimeString from "../time/convertISOToDateTimeString";

const parseCommentDataFrontendView = (commentJson) => {
  const parsedCommentObj = {};
  const flattenedJson = commentJson.map((obj) => {
    const newCommentObj = {};
    newCommentObj.username = obj.userId.username;
    newCommentObj.message = obj.message;
    newCommentObj.createTime = obj.createTime == null ? null : convertISOToDateTimeString(obj.createTime)
    newCommentObj.name = obj.locationId.name;
    return newCommentObj;
  });
  const uniqueLocation = new Array(
    ...new Set(flattenedJson.map((obj) => obj.name))
  );
  uniqueLocation.forEach((location) => {
    parsedCommentObj[location] = flattenedJson.filter(
      (obj) => obj.name === location
    );
  });
  return parsedCommentObj;
};
export default parseCommentDataFrontendView;
