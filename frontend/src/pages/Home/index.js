import { useContext } from "react";
import { AuthContext } from "../../middleware/auth";
import AdminView from "./adminView";
import UserView from "./userHome";

const Home = () => {
  const {
    user: { username, isAdmin, email, viewMode },
    logout,
  } = useContext(AuthContext);
  return (
    <>
      {isAdmin ? (
        <AdminView
          username={username}
          email={email}
          viewMode={viewMode}
          logout={logout}
        />
      ) : (
        <UserView
          username={username}
          email={email}
          viewMode={viewMode}
          logout={logout}
        />
      )}
    </>
  );
};

export default Home;
