//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const connectWeatherDB =
  require("../../generalUtils/database").connectWeatherDB;
const commentSchema = require("../../backendConfig.js").databaseConfig
  .commentSchema;

const insertCommentToDB = async function (
  commentUserId,
  commentLocationId,
  commentMessage
) {
  const commentInfo = {
    userId: commentUserId,
    locationId: commentLocationId,
    createTime: Date(Date.now()).toString(),
    message: commentMessage,
  };
  const weatherDB = await connectWeatherDB();
  const Comment = weatherDB.model("Comment", commentSchema);
  const result = await Comment.create(commentInfo);
};

module.exports = { insertCommentToDB };
