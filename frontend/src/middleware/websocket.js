import { useState, createContext, useEffect } from "react";

const WebSocketContext = createContext({});

const WebSocketProvider = (props) => {
  const [webSocket, setWebSocket] = useState(null);
  const [logined, SetLogined] = useState(false);

  useEffect(() => {
      if (logined) {
        
    }
  }, [logined]);

  return (
    <WebSocketContext.Provider value={{ SetLogined, webSocket }}>
      {props.children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext, WebSocketProvider };
