exports.parseGovtTimeString = function (timeString) {
  const timeStringPattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/;
  const timeStringMatch = timeString.match(timeStringPattern);
  const newObject = {
    year: Number(timeStringMatch[1]),
    month: Number(timeStringMatch[2]),
    day: Number(timeStringMatch[3]),
    hour: Number(timeStringMatch[4]),
    minute: Number(timeStringMatch[5]),
  };
  return newObject;
};
