import convertISOToDateTimeString from "../time/convertISOToDateTimeString";

const parseCommentDataFrontendView = (commentJson) => {
    const parsedCommentObj = {};
    commentJson.map((obj) => {
      if (!(obj.locationId.name in parsedCommentObj)) {
        parsedCommentObj[obj.locationId.name] = [];
      }
      parsedCommentObj[obj.locationId.name].push({
        "username": obj.userId.username,
        "message": obj.message,
        "createTime": obj.createTime == null ? null : convertISOToDateTimeString(obj.createTime)
      });
    });
    return parsedCommentObj;
  };
  
  export default parseCommentDataFrontendView;
  