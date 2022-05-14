//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

const camelToCapitalize = (word) => {
  const result = word.replace(/([A-Z])/g, " $1");
  return result.split(" ").map(capitalize).join(" ");
};

export default camelToCapitalize;
