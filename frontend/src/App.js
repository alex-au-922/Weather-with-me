import "./App.css";
import React, { useEffect, useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { FullScreenLoading } from "./utils/loading";
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
        </Routes>
      )}
    </>
  );
};

export default App;
