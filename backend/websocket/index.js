const { decryptAccessToken } = require("../generalUtils/userCreds/accessToken");
const {
  checkUserCredentialsById,
} = require("../generalUtils/userCreds/username");

const SocketServer = require("ws").Server;
const logger = require("../generalUtils/getLogger").getLogger();

const webSocketClients = {};

const registerSendData = (wssClientsInfo) => {
  //usage: sendData(channel)(data, <userId>)
  const sendData =
    (channel) =>
    (data, userId = null) => {
      if (userId === null)
        Object.values(wssClientsInfo).forEach(
          //whether the user subscribed to that channel
          ({ channels, webSocket }) => channels[channel] && webSocket.send(data)
        );
      else {
        if (wssClientsInfo[userId][channel])
          wssClientsInfo[userId].webSocket.send(data);
      }
    };

  return sendData;
};

/*
Data Channels: 
1) user
2) weatherLoc
3) log
4) comment
*/
const createWebSocketServer = () => {
  // const websocketServer = new SocketServer({
  //   port: process.env.WS_PORT,
  //   path: "/websocket",
  // });
  // websocketServer.on("connection", async (webSocket, req) => {
  //   const clientAddress = req.socket.remoteAddress;
  //   const clientUserAgent = req.headers["user-agent"];
  //   const { token: accessToken, user, weatherLoc, log, comment } = req.query;
  //   if (accessToken === null) webSocket.terminate();
  //   const userId = decryptAccessToken(accessToken);
  //   if (userId === null) webSocket.terminate();
  //   const existUser = await checkUserCredentialsById(userId);
  //   if (existUser === null) webSocket.terminate();
  //   const { role } = existUser;
  //   const subscribedChannels = {
  //     user,
  //     weatherLoc,
  //     log: role === "admin" ? log : false,
  //     comment,
  //   };
  //   webSocketClients[userId] = {
  //     userAgent: clientUserAgent,
  //     ip: clientAddress,
  //     role,
  //     webSocket,
  //     channels: subscribedChannels,
  //   };
  //   let subscribedChannelsArray = Object.keys(subscribedChannels).map(
  //     (prevArray, currKey) =>
  //       subscribedChannels[currKey] ? [...prevArray, currKey] : prevArray,
  //     []
  //   );
  //   logger.info(
  //     `Client "${clientAddress}" connected. Subscribed channels ${subscribedChannelsArray}`
  //   );
  //   webSocket.on("close", () => {
  //     logger.info(`Client "${clientAddress}" closed connection`);
  //     delete webSocketClients[userId];
  //   });
  // });
  // const sendData = registerSendData(webSocketClients);
  // return sendData;
};

exports.createWebSocketServer = createWebSocketServer;
exports.webSocketClients = webSocketClients;
