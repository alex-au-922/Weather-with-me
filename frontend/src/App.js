//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import "./App.css";
import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { FullScreenLoading } from "./utils/gui/loading";
import routes from "./configs/routes";
import { AuthContext } from "./middleware/auth";

const App = () => {
  const { user, fetching } = useContext(AuthContext);

  return (
    <>
      {fetching ? (
        <FullScreenLoading />
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              user.authenticated ? (
                <Navigate to="/home" exact />
              ) : (
                <Navigate to="/login" exact />
              )
            }
          />
          {routes.map((route, index) => (
            <Route
              key={index}
              exact
              element={
                route.protected ? (
                  user.authenticated ? (
                    route.component
                  ) : (
                    <Navigate to="/" />
                  )
                ) : (
                  route.component
                )
              }
              path={route.path}
            />
          ))}
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </>
  );
};

export default App;
