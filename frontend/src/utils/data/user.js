const parseUserDataFrontendView = (userJson) => {
  const userList = userJson
    .filter((obj) => obj.role !== "admin")
    .map((obj) => {
      const newUserObject = { ...obj };
      delete newUserObject.role;
      return newUserObject;
    });
  return userList;
};

export default parseUserDataFrontendView;
