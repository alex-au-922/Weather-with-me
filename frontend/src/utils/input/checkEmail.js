const validateEmail = (email) => {
  const response = {
    success: false,
    error: "",
  };
  const pattern =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (email.match(pattern)) response.success = true;
  else response.error = "Invalid email format!";
  return response;
};

export default validateEmail;
