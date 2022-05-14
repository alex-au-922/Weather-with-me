//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const registerMessageListener = (socket, event, handleFunction) => {
  if (socket !== null && socket !== undefined) {
    socket.on(event, handleFunction);
    return () => socket.off(event, handleFunction);
  }
};

exports.registerMessageListener = registerMessageListener;
