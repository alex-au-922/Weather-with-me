const checkString = (string) => {
  const response = {
    success: false,
    error: "",
  };
  const stringValid = Boolean(String(string).match(/^.{4,20}$/));
  if (stringValid) response.success = true;
  else
    response.error =
      "Please enter a string with length between 4 and 20 characters!";
  return response;
};

export default checkString;
