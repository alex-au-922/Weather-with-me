const events = require("events");

const eventEmitter = new events.EventEmitter();

const emitUserUpdate = (userIp) => {
  eventEmitter.emit("userUpdate", userIp);
};

exports.eventEmitter = eventEmitter;
exports.emitUserUpdate = emitUserUpdate;
