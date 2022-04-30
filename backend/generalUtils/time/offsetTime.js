const offsetTime = (timeOffset) => {
  const now = new Date();
  const offsetTime = new Date(now.getTime() + timeOffset);
  return offsetTime;
};

exports.offsetTime = offsetTime;
