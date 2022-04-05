import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import decryptJwt from "../utils/jwt/decrypt";

const AuthContext = createContext({});

const AuthProvider = (props) => {
  const [fetching, setFetching] = useState(true);
  const [user, setUser] = useState({
    username: null,
    role: null,
    viewMode: null,
    email: null,
    authenticated: false,
  });
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const { success, result } = await decryptJwt();
      if (success && !result.expired) {
        setUser({
          username: result.username,
          role: result.role,
          viewMode: result.viewMode,
          email: result.email,
          authenticated: true,
        });
      }
      setFetching(false);
    })();
  }, [fetching]);
  const login = () => {
    navigate("/");
    setFetching(true);
  };
  const logout = () => {
    setUser({
      username: null,
      role: null,
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
