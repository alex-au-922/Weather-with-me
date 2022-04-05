const checkString = (string) => {
  const stringValid = Boolean(String(string).match(/(?=.{4,20})/));
  if (stringValid) return { success: true, error: null };
  else return { success: false, error: "Please enter 4 - 20 characters!" };
};

export default checkString;
