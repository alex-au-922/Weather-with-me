const checkString = (string) => {
  const stringValid = Boolean(String(string).match(/(?=.{4,20})/));

  return stringValid;
};

export default checkString;
