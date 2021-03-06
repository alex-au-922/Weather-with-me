//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import { useState, useContext, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FetchStateContext } from "./fetch";
import tokenLogin from "../utils/authUtils/tokenLogin";
import { initFetchUserData } from "../utils/data/user";

const AuthContext = createContext({});

const AuthProvider = (props) => {
  const [fetching, setFetching] = useState(true);
  const [user, setUser] = useState({
    username: null,
    isAdmin: null,
    viewMode: null,
    email: null,
    favouriteLocation: [],
    authenticated: false,
  });

  const { fetchFactory } = useContext(FetchStateContext);
  const loginFetch = fetchFactory({
    loading: false,
    success: false,
    error: false,
  });

  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      if (fetching) {
        const { success: validateSuccess, fetching: tokenFetching } =
          await tokenLogin(loginFetch);
        if (!tokenFetching) {
          if (validateSuccess) {
            const {
              success: userFetchSuccess,
              result: userData,
              fetching: userFetching,
            } = await initFetchUserData(loginFetch);
            if (!userFetching) {
              if (userFetchSuccess) {
                setUser({
                  username: userData.username,
                  isAdmin: userData.role === "admin",
                  viewMode: userData.viewMode,
                  email: userData.email,
                  favouriteLocation: userData.favouriteLocation.map(
                    (geolocationObj) => geolocationObj.name
                  ),
                  authenticated: true,
                });
              } else {
                navigate("/login");
              }
            }
          }
          setFetching(false);
        }
      }
    })();
  }, [fetching]);

  const login = () => {
    navigate("/");
    setFetching(true);
  };
  const logout = async () => {
    setUser({
      username: null,
      isAdmin: null,
      viewMode: null,
      email: null,
      favouriteLocation: [],
      authenticated: false,
    });
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        fetching,
        login,
        logout,
        setUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
