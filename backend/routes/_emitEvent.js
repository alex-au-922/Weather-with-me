const events = require("events");

const eventEmitter = new events.EventEmitter();

//TODO: update the user and the admin under the channel of
//TODO: user
const emitUserUpdate = (userId) => {
  eventEmitter.emit("userUpdate", userId);
};

//TODO: update all people connected to the channel
//TODO: weather
const weatherUpdate = () => {
  eventEmitter.emit("weatherUpdate");
};

//TODO: update all people connected to the channel
//TODO: log
const logUpdate = () => {
  eventEmitter.emit("logUpdate");
};

//TODO: update all people connected to the channel
//TODO: comment
const commentUpdate = () => {
  eventEmitter.emit("commentUpdate");
};

exports.eventEmitter = eventEmitter;
exports.emitUserUpdate = emitUserUpdate;
exports.weatherUpdate = weatherUpdate;
exports.logUpdate = logUpdate;
exports.commentUpdate = commentUpdate;
