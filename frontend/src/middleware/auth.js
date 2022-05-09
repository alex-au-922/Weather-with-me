import { useState, useContext, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WeatherWebSocketContext, UserWebSocketContext } from "./websocket";
import { FetchStateContext } from "./fetch";
import tokenLogin from "../utils/authUtils/tokenLogin";
import { initFetchUserData } from "../utils/data/user";
import { registerMessageListener } from "../utils/listeners/webSocketMessage";

const AuthContext = createContext({});

const AuthProvider = (props) => {
  const [fetching, setFetching] = useState(true);
  const [user, setUser] = useState({
    username: null,
    isAdmin: null,
    viewMode: null,
    email: null,
    authenticated: false,
  });
  const {
    webSocket: userWebSocket,
    connectWebSocket: connectUserWebSocket,
    disconnectWebSocket: disconnectUserWebSocket,
  } = useContext(UserWebSocketContext);
  const {
    connectWebSocket: connectWeatherWebSocket,
    disconnectWebSocket: disconnectWeatherWebSocket,
  } = useContext(WeatherWebSocketContext);
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
    if (user.authenticated) {
      connectWeatherWebSocket();
      connectUserWebSocket();
    } else {
      disconnectWeatherWebSocket();
      disconnectUserWebSocket();
    }
  }, [user.authenticated]);

  useEffect(() => {
    const handler = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "auth") {
        setUser({
          ...user,
          username: message.data.username,
          isAdmin: message.data.role === "admin",
          viewMode: message.data.viewMode,
          email: message.data.email,
        });
      }
    };
    return registerMessageListener(userWebSocket, handler);
  }, [userWebSocket]);

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
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
