import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./middleware/auth";
import { StateProvider } from "./middleware/fetch";
import {
  WeatherWebSocketProvider,
  UserWebSocketProvider,
} from "./middleware/websocket";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <WeatherWebSocketProvider>
        <UserWebSocketProvider>
          <StateProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </StateProvider>
        </UserWebSocketProvider>
      </WeatherWebSocketProvider>
    </BrowserRouter>
  </React.StrictMode>
);
