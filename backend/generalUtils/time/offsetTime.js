const offsetTime = (timeOffset) => {
  const now = new Date();
  const offsetTime = new Date(now.getTime() + timeOffset);
  return offsetTime;
};

const dateExpired = (time) => {
  return Date() > time;
};

exports.offsetTime = offsetTime;
exports.dateExpired = dateExpired;
