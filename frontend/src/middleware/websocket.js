import { useState, createContext, useContext, useEffect } from "react";
import { BACKEND_WS_HOST } from "../frontendConfig";
import { AuthContext } from "./auth";
import { io } from "socket.io-client";

const WebSocketContext = createContext({});

const WebSocketProvider = (props) => {
  const { user } = useContext(AuthContext);
  const [webSocket, setWebSocket] = useState(null);

  useEffect(() => {
    if (user.authenticated) {
      try {
        const socket = io("http://alexauwork.com:10083", {
          extraHeaders: {
            authorization: localStorage.getItem("accessToken"),
          },
          query: {
            user: true,
            log: false,
            comment: true,
            weatherLoc: true,
          },
        });
        socket.on("user initial", (message) => console.log(message));
        socket.onAny((message) => {
          console.log("message", message);
        });
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
