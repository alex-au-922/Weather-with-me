import { useState, createContext, useEffect } from "react";
import { BACKEND_USERWS_HOST, BACKEND_WEATHERWS_HOST } from "../frontendConfig";

const WeatherWebSocketContext = createContext({});

const UserWebSocketContext = createContext({});

const WeatherWebSocketProvider = (props) => {
  const [webSocket, setWebSocket] = useState(null);
  const [connect, setConnect] = useState(false);

  useEffect(() => {
    if (connect) {
      try {
        const newWebSocket = new WebSocket(
          `${BACKEND_WEATHERWS_HOST}/websockets/weather`
        );
        newWebSocket.onopen = () => {
          console.log("open connection");
          console.log(newWebSocket);
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
  }, [connect]);

  const connectWebSocket = () => {
    setConnect(true);
  };
  const disconnectWebSocket = () => {
    setConnect(false);
  };

  return (
    <WeatherWebSocketContext.Provider
      value={{ webSocket, connectWebSocket, disconnectWebSocket }}
    >
      {props.children}
    </WeatherWebSocketContext.Provider>
  );
};

const UserWebSocketProvider = (props) => {
  const [webSocket, setWebSocket] = useState(null);
  const [connect, setConnect] = useState(false);

  useEffect(() => {
    if (connect) {
      try {
        const newWebSocket = new WebSocket(
          `${BACKEND_USERWS_HOST}/websockets/user`
        );
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
    <UserWebSocketContext.Provider
      value={{ webSocket, connectWebSocket, disconnectWebSocket }}
    >
      {props.children}
    </UserWebSocketContext.Provider>
  );
};

export {
  WeatherWebSocketContext,
  WeatherWebSocketProvider,
  UserWebSocketContext,
  UserWebSocketProvider,
};
