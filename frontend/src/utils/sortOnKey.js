export default function sortOnKey(list, key, descending = false) {
  return list.sort((leftObj, rightObj) => {
    const leftVal = leftObj[key];
    const rightVal = rightObj[key];
    let order;
    if (descending) {
      if (!leftVal) order = 1;
      else if (!rightVal) order = -1;
      else {
        if (leftVal > rightVal) order = -1;
        else if (leftVal < rightVal) order = 1;
        else order = 0;
      }
    } else {
      if (!leftVal) order = -1;
      else if (!rightVal) order = 1;
      else {
        if (leftVal > rightVal) order = 1;
        else if (leftVal < rightVal) order = -1;
        else order = 0;
      }
    }
    return order;
  });
}
