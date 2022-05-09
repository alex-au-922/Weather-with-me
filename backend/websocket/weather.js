const SocketServer = require("ws").Server;
const logger = require("../generalUtils/getLogger").getLogger();
const registerSendData = require("./");

const weatherWebSocketClients = {};

const createWeatherWebSocketServer = () => {
  const websocketServer = new SocketServer({
    port: process.env.WEATHERWS_PORT,
    path: "/websockets/weather",
  });
  websocketServer.on("connection", (webSocket, req) => {
    const clientAddress = req.socket.remoteAddress;
    if (weatherWebSocketClients[clientAddress] === undefined)
      webSocket.terminate();
    else weatherWebSocketClients[clientAddress].webSocket = webSocket;
    logger.info(`Client "${clientAddress}" connected to /websockets/weather`);
    webSocket.on("close", () => {
      logger.info(
        `Client "${clientAddress}" closed connection from /websockets/weather`
      );
    });
  });
  const sendData = registerSendData(websocketServer, weatherWebSocketClients);
  return sendData;
};

exports.createWeatherWebSocketServer = createWeatherWebSocketServer;
exports.weatherWebSocketClients = weatherWebSocketClients;
