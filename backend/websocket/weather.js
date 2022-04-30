const SocketServer = require("ws").Server;
const logger = require("../generalUtils/getLogger").getLogger();
const registerSendData = require("./");

const createWeatherWebSocketServer = (expressServer) => {
  const websocketServer = new SocketServer({
    port: process.env.WEATHERWS_PORT,
    path: "/websockets/weather",
  });
  websocketServer.on("connection", (ws, req) => {
    const clientAddress = req.socket.remoteAddress;
    logger.info(`Client "${clientAddress}" connected to /websockets/weather`);
    ws.on("close", () => {
      logger.info(
        `Client "${clientAddress}" closed connection from /websockets/weather`
      );
    });
  });
  const sendData = registerSendData(websocketServer);
  return sendData;
};

exports.createWeatherWebSocketServer = createWeatherWebSocketServer;
