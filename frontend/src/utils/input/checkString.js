const checkString = (string) => {
  const response = {
    success: false,
    error: null,
    errorType: null,
  };
  const stringValid = Boolean(String(string).match(/(?=.{4,20})/));
  if (stringValid) {
    response.success = true;
  } else {
    response.errorType = "INSUFFICIENT_LENGTH";
    response.error = "Please enter 4 - 20 characters!";
  }
  return response;
};

export default checkString;
