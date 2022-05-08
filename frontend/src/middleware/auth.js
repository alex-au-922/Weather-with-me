import { useState, useContext, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WeatherWebSocketContext, UserWebSocketContext } from "./websocket";
import { FetchStateContext } from "./fetch";
import tokenLogin from "../utils/authUtils/tokenLogin";
import { initFetchUserData } from "../utils/data/user";

const AuthContext = createContext({});

const AuthProvider = (props) => {
  const [fetching, setFetching] = useState(true);
  const [logined, setLogined] = useState(false);
  const [user, setUser] = useState({
    username: null,
    isAdmin: null,
    viewMode: null,
    email: null,
    authenticated: false,
  });
  const weatherWSContext = useContext(WeatherWebSocketContext);
  const userWSContext = useContext(UserWebSocketContext);
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
            console.log(userFetchSuccess, userData, userFetching);
            if (!userFetching) {
              if (userFetchSuccess) {
                setUser({
                  username: userData.username,
                  isAdmin: userData.role === "admin",
                  viewMode: userData.viewMode,
                  email: userData.email,
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

  useEffect(() => {
    if (user.authenticated && logined) {
      weatherWSContext.connectWebSocket();
      if (user.isAdmin) {
        userWSContext.connectWebSocket();
      }
    } else {
      weatherWSContext?.disconnectWebSocket();
      userWSContext?.disconnectWebSocket();
    }
  }, [user.authenticated, logined]);

  const login = () => {
    navigate("/");
    setFetching(true);
    setLogined(true);
  };
  const logout = async () => {
    setUser({
      username: null,
      isAdmin: null,
      viewMode: null,
      email: null,
      authenticated: false,
    });
    navigate("/login");
    setLogined(false);
  };
  return (
    <AuthContext.Provider value={{ user, fetching, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
