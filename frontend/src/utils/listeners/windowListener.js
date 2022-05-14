//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const registerWindowListener = (event, handleFunction) => {
  window.addEventListener(event, handleFunction);
  return () => window.removeEventListener(event, handleFunction);
};
exports.registerWindowListener = registerWindowListener;
