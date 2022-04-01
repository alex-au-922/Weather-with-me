exports.checkString = function (string) {
  return Boolean(String(string).match(/(?=.{4,20})/));
};
