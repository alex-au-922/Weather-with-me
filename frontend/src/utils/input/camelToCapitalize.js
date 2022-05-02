const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

const camelToCapitalize = (word) => {
  const result = word.replace(/([A-Z])/g, " $1");
  return result.split(" ").map(capitalize).join(" ");
};

export default camelToCapitalize;
