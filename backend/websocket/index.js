const registerSendData = (wss) => {
  const sendData = (data) => {
    wss.clients.forEach((client) => client.send(data));
  };
  return sendData;
};

module.exports = registerSendData;
