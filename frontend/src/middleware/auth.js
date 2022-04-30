import { useState, useContext, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WeatherWebSocketContext, UserWebSocketContext } from "./websocket";
import decryptJwt from "../utils/jwt/decrypt";

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
  const weatherWSContext = useContext(WeatherWebSocketContext);
  const userWSContext = useContext(UserWebSocketContext);

  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const { success, result } = await decryptJwt();
      if (success && !result.expired) {
        const isAdmin = result.role === "admin";
        setUser({
          username: result.username,
          isAdmin,
          viewMode: result.viewMode,
          email: result.email,
          authenticated: true,
        });
        weatherWSContext.connectWebSocket();
        if (isAdmin) {
          userWSContext.connectWebSocket();
        }
      }
      setFetching(false);
    })();
  }, [fetching]);
  const login = () => {
    navigate("/");
    setFetching(true);
  };
  const logout = async () => {
    weatherWSContext.disconnectWebSocket();
    userWSContext.disconnectWebSocket();
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
    <AuthContext.Provider value={{ user, fetching, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
