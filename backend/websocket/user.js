const SocketServer = require("ws").Server;
const logger = require("../generalUtils/getLogger").getLogger();
const registerSendData = require("./");

const userWebSocketClients = {};

const createUserWebSocketServer = () => {
  const websocketServer = new SocketServer({
    port: process.env.USERWS_PORT,
    path: "/websockets/user",
  });

  websocketServer.on("connection", (webSocket, req) => {
    const clientAddress = req.socket.remoteAddress;
    if (userWebSocketClients[clientAddress] === undefined)
      webSocket.terminate();
    else userWebSocketClients[clientAddress].webSocket = webSocket;
    logger.info(`Client "${clientAddress}" connected to /websockets/user`);
    webSocket.on("close", () => {
      delete userWebSocketClients[clientAddress];
      logger.info(
        `Client "${clientAddress}" closed connection from /websockets/user`
      );
    });
  });
  const sendData = registerSendData(websocketServer, userWebSocketClients);
  return sendData;
};

exports.createUserWebSocketServer = createUserWebSocketServer;
exports.userWebSocketClients = userWebSocketClients;
