import { useState, createContext, useContext, useEffect } from "react";
import { BACKEND_WS_HOST } from "../frontendConfig";
import { AuthContext } from "./auth";
import { io } from "socket.io-client";
import { registerMessageListener } from "../utils/listeners/webSocketMessage";
import { useNavigate } from "react-router-dom";
const WebSocketContext = createContext({});

const WebSocketProvider = (props) => {
  const { user, logout } = useContext(AuthContext);
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

  useEffect(() => {
    if (webSocket) {
      const updateUserDataHandler = (newUserDatum) => {
        const newUserObj = JSON.parse(newUserDatum);
        user.setUser({
          ...user,
          username: newUserObj.username,
          viewMode: newUserObj.viewMode,
          email: newUserObj.email,
          favouriteLocation: newUserObj.favouriteLocation.map(
            (geolocationObj) => geolocationObj.name
          ),
        });
      };
      const deleteUserHandler = () => {
        logout();
      };
      const unregisterUpdateUserData = registerMessageListener(
        webSocket,
        "updateUserDatum",
        updateUserDataHandler
      );
      const unregisterDeleteUser = registerMessageListener(
        webSocket,
        "deleteUser",
        deleteUserHandler
      );
      return () => {
        unregisterUpdateUserData();
        unregisterDeleteUser();
      };
    }
  }, [webSocket]);

  return (
    <WebSocketContext.Provider value={{ webSocket }}>
      {props.children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext, WebSocketProvider };
