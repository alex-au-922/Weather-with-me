//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

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
