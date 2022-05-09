const registerSendData = (wss, wssClientsObject) => {
  const sendData = (data, ip = null) => {
    if (ip === null) wss.clients.forEach((client) => client.send(data));
    else wssClientsObject[ip]?.webSocket.send(data);
  };
  return sendData;
};

module.exports = registerSendData;
