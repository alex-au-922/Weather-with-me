const objectSetAll = (object, value) => {
  const newObject = { ...object };
  Object.keys(newObject).forEach((key) => (newObject[key] = value));
  return newObject;
};

export default objectSetAll;
