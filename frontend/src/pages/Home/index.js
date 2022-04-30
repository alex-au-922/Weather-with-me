import { useContext } from "react";
import { AuthContext } from "../../middleware/auth";
import AdminView from "./adminView";
import UserView from "./userHome";
import NavBar from "../../components/navbar";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <>
      <NavBar user={user} logout={logout}>
        {user.isAdmin ? <AdminView /> : <UserView />}
      </NavBar>
    </>
  );
};

export default Home;
