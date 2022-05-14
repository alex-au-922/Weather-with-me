//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

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
