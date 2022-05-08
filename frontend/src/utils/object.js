const objectSetAll = (object, value) => {
  const newObject = { ...object };
  Object.keys(newObject).forEach((key) => (newObject[key] = value));
  return newObject;
};

const objectEqual = (leftObj, rightObj) => {
  const result = Object.keys(leftObj).reduce(
    (prevBool, key) => leftObj[key] === rightObj[key] && prevBool,
    true
  );
  return result;
};

export { objectSetAll, objectEqual };
