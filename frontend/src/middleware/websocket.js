import { useState, createContext, useEffect } from "react";

const WebSocketContext = createContext({});

const WebSocketProvider = (props) => {
  const [webSocket, setWebSocket] = useState(null);
  const [connect, setConnect] = useState(false);

  useEffect(() => {
    if (connect) {
      try {
        const newWebSocket = new WebSocket("ws://localhost:10083/websockets");
        newWebSocket.onopen = () => {
          console.log("open connection");
          console.log(newWebSocket);
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
  }, [connect]);

  const connectWebSocket = () => {
    setConnect(true);
  };
  const disconnectWebSocket = () => {
    setConnect(false);
  };

  return (
    <WebSocketContext.Provider
      value={{ webSocket, connectWebSocket, disconnectWebSocket }}
    >
      {props.children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext, WebSocketProvider };
