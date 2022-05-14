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
