const SocketServer = require("ws").Server;
const logger = require("../generalUtils/getLogger").getLogger();

const registerSendData = (wss) => {
  const sendData = (data) => {
    wss.clients.forEach((client) => client.send(data));
  };
  return sendData;
};

const createWebSocketServer = (expressServer) => {
  const websocketServer = new SocketServer({
    noServer: true,
    path: "/websockets",
  });
  expressServer.on("upgrade", (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      websocketServer.emit("connection", websocket, request);
    });
  });
  websocketServer.on("connection", (ws, req) => {
    const clientAddress = req.socket.remoteAddress;
    logger.info(`Client "${clientAddress}" connected`);
    ws.on("close", () => {
      logger.info(`Client "${clientAddress}" closed connection`);
    });
  });
  const sendData = registerSendData(websocketServer);
  return sendData;
};

module.exports = createWebSocketServer;
