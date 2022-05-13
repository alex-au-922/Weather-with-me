const { decryptAccessToken } = require("../generalUtils/userCreds/accessToken");
const {
  checkUserCredentialsById,
} = require("../generalUtils/userCreds/username");
const { NotAccetpedError } = require("../backendConfig");

const { Server } = require("socket.io");
const logger = require("../generalUtils/getLogger").getLogger();

let io;
let sendData;
const socketClients = {};

const registerSendData = (socketClientsInfo) => {
  //usage: sendData(channel)(event, data, <userId>)
  const sendData =
    (channel) =>
    (event, data) =>
    (admin = true, userId = null) => {
      if (userId === null)
        if (admin)
          //value is the object of all connection details
          //whether the user subscribed to that channel
          io.sockets.in(channel).emit(event, data);
        else {
          Object.values(socketClients)
            .filter(({ role }) => role !== "admin")
            .forEach(({ socket }) => socket.to(channel).emit(event, data));
        }
      else if (userId === undefined) {
        if (admin) {
          Object.values(socketClients)
            .filter(({ role }) => role === "admin")
            .forEach(({ socket }) => socket.to(channel).emit(event, data));
        }
      } else {
        socketClientsInfo[userId].socket.to(channel).emit(event, data);
        if (admin) {
          Object.values(socketClients)
            .filter(({ role }) => role === "admin")
            .forEach(({ socket }) => socket.to(channel).emit(event, data));
        }
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
const createSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      // origin: "http://52.76.77.52:8000",
      origin: "http://localhost:10084",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", async (socket) => {
    try {
      const clientAddress = socket.handshake.address;
      const clientUserAgent = socket.request.headers["user-agent"];
      const { user, weatherLoc, log, comment } = socket.handshake.query;
      const { authorization: accessToken } = socket.handshake.headers;
      if (accessToken === null || accessToken === undefined)
        throw new NotAccetpedError(
          "Authorization is required for connecting websocket!"
        );
      const userId = decryptAccessToken(accessToken);
      if (userId === null)
        throw new UnauthorizationError("User does not exist!");
      const existUser = await checkUserCredentialsById(userId);
      if (existUser === null)
        throw new UnauthorizationError("User does not exist!");
      const { role } = existUser;
      const subscribedChannels = {
        user: Boolean(user),
        weatherLoc: Boolean(weatherLoc),
        log: role === "admin" ? Boolean(log) : false,
        comment: Boolean(comment),
      };
      if (subscribedChannels.user) socket.join("user");
      if (subscribedChannels.weatherLoc) socket.join("weatherLoc");
      if (subscribedChannels.log) socket.join("log");
      if (subscribedChannels.comment) socket.join("comment");
      socket.join("system");

      socketClients[userId] = {
        userAgent: clientUserAgent,
        address: { ip: clientAddress.address, port: clientAddress.port },
        role,
        socket,
        channels: subscribedChannels,
      };

      let subscribedChannelsArray = Object.keys(subscribedChannels).reduce(
        (prevArray, currKey) =>
          subscribedChannels[currKey] ? [...prevArray, currKey] : prevArray,
        []
      );
      logger.info(
        `Client "${clientAddress}" connected. Subscribed channels ${subscribedChannelsArray}`
      );
      socket.on("disconnect", () => {
        logger.info(`Client "${clientAddress}" closed connection`);
        delete socketClients[userId];
      });
    } catch (error) {
      logger.info(error.message);
      socket.disconnect();
      return null;
    }
  });
  const sendData = registerSendData(socketClients);
  return sendData;
};

exports.createSocketServer = createSocketServer;
exports.socketClients = socketClients;
exports.sendData = sendData;
