const parseCommentDataFrontendView = (commentJson) => {
  const parsedCommentObj = {};
  const flattenedJson = commentJson.map((obj) => {
    const newCommentObj = {};
    newCommentObj.username = obj.userId.username;
    newCommentObj.message = obj.message;
    newCommentObj.createTime = obj.createTime;
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
