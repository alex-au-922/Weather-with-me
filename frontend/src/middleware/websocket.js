import { useState, createContext, useContext, useEffect } from "react";
import { BACKEND_WS_HOST } from "../frontendConfig";
import { AuthContext } from "./auth";

const WebSocketContext = createContext({});

const WebSocketProvider = (props) => {
  const { user } = useContext(AuthContext);
  const [webSocket, setWebSocket] = useState(null);

  useEffect(() => {
    if (user.authenticated) {
      try {
        let webSocketUri;
        if (user.authenticated) {
          if (user.isAdmin)
            webSocketUri = `${BACKEND_WS_HOST}/websocket?user=true&weatherLoc=true&log=true&comment=true`;
          else
            webSocketUri = `${BACKEND_WS_HOST}/websocket?user=true&weatherLoc=true&comment=true`;
        }
        const newWebSocket = new WebSocket(webSocketUri);
        newWebSocket.onopen = () => {
          console.log("open connection");
          console.log(newWebSocket);
        };
        newWebSocket.onmessage = () => {
          console.log("received message!");
        };
        newWebSocket.onclose = () => {
          console.log("close connection!");
        };
        setWebSocket(newWebSocket);
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
