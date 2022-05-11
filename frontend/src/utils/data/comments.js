const parseCommentDataFrontendView = (commentJson) => {
    const parsedCommentObj = {};
    commentJson.map((obj) => {
      if (!(obj.locationId.name in parsedCommentObj)) {
        parsedCommentObj[obj.locationId.name] = [];
      }
      parsedCommentObj[obj.locationId.name].push({
        "username": obj.userId.username,
        "message": obj.message,
        "createTime": obj.createTime
      });
    });
    return parsedCommentObj;
  };
  
  export default parseCommentDataFrontendView;
  