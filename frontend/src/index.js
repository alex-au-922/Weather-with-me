//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./middleware/auth";
import { FetchStateProvider } from "./middleware/fetch";
import { WebSocketProvider } from "./middleware/websocket";
import { FormBufferProvider } from "./pages/Home/admin/contexts/formBufferProvider";
import { CommentBufferProvider } from "./pages/Home/user/contexts/commentBufferProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <FetchStateProvider>
        <AuthProvider>
          <WebSocketProvider>
            <FormBufferProvider>
              <CommentBufferProvider>
                <App />
              </CommentBufferProvider>
            </FormBufferProvider>
          </WebSocketProvider>
        </AuthProvider>
      </FetchStateProvider>
    </BrowserRouter>
  </React.StrictMode>
);
