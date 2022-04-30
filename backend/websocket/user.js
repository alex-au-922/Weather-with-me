const SocketServer = require("ws").Server;
const logger = require("../generalUtils/getLogger").getLogger();
const registerSendData = require("./");

const createUserWebSocketServer = (expressServer) => {
  const websocketServer = new SocketServer({
    port: process.env.USERWS_PORT,
    path: "/websockets/user",
  });

  websocketServer.on("connection", (ws, req) => {
    const clientAddress = req.socket.remoteAddress;
    logger.info(`Client "${clientAddress}" connected to /websockets/user`);
    ws.on("close", () => {
      logger.info(
        `Client "${clientAddress}" closed connection from /websockets/user`
      );
    });
  });
  const sendData = registerSendData(websocketServer);
  return sendData;
};

exports.createUserWebSocketServer = createUserWebSocketServer;
