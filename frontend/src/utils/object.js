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

const objectAny = (object, value) => {
  return Object.keys(object).reduce(
    (prevBool, currKey) => object[currKey] === value || prevBool,
    false
  );
};

export { objectSetAll, objectEqual, objectAny };
