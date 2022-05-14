//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

export default function sortOnKey(list, key, descending=false) {
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
