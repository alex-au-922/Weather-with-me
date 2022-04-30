exports.parseGovtTimeString = function (timeString) {
  const timeStringPattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/;
  const timeStringMatch = timeString.match(timeStringPattern);
  const year = timeStringMatch[1];
  const month = timeStringMatch[2];
  const day = timeStringMatch[3];
  const timeZoneOffset = 8; //hack, will think a better way
  const hour = timeStringMatch[4];
  const minute = timeStringMatch[5];
  const newDate = new Date(year, month - 1, day, hour - timeZoneOffset, minute);
  return newDate;
};
