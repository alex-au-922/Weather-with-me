//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import { useState, createContext, useContext, useEffect } from "react";
import { BACKEND_WS_HOST } from "../frontendConfig";
import { AuthContext } from "./auth";
import { io } from "socket.io-client";
const WebSocketContext = createContext({});

const WebSocketProvider = (props) => {
  const { user, logout, setUser } = useContext(AuthContext);
  const [webSocket, setWebSocket] = useState(null);

  useEffect(() => {
    if (user.authenticated) {
      try {
        const socket = io(`${BACKEND_WS_HOST}`, {
          extraHeaders: {
            authorization: localStorage.getItem("accessToken"),
          },
          query: {
            user: true,
            log: user.isAdmin,
            comment: true,
            weatherLoc: true,
          },
        });
        if (!user.isAdmin) {
          socket.on("updatedUserDatum", (newUserDatum) => {
            setUser({
              ...user,
              username: newUserDatum.username,
              viewMode: newUserDatum.viewMode,
              email: newUserDatum.email,
              favouriteLocation: newUserDatum.favouriteLocation.map(
                (geolocationObj) => geolocationObj.name
              ),
            });
          });
          socket.on("deleteUser", (message) => {
            logout();
          });
        }
        socket.io.on("reconnect", () => console.log("socket reconnected!"));
        socket.onAny((eventName) => console.log(eventName));
        socket.io.on("error", (message) => console.log(message));

        setWebSocket(socket);
      } catch (error) {
        console.log(error);
      }
    } else {
      if (webSocket) {
        webSocket.close();
        setWebSocket(null);
      }
    }
  }, [user.authenticated]);

  return (
    <WebSocketContext.Provider value={{ webSocket }}>
      {props.children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext, WebSocketProvider };
