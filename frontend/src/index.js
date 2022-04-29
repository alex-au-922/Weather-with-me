import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./middleware/auth";
import { WebSocketProvider } from "./middleware/websocket";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <WebSocketProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </WebSocketProvider>
    </BrowserRouter>
  </React.StrictMode>
);
