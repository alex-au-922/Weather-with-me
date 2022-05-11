import { useContext } from "react";
import { AuthContext } from "../../middleware/auth";
import { FormBufferProvider } from "./admin/contexts/formBufferProvider";
import { CommentBufferProvider } from "./user/contexts/commentBufferProvider";
import AdminView from "./admin";
import UserView from "./user";
import NavBar from "../../components/navbar";

const Home = () => {
  const { user } = useContext(AuthContext);
  return (
    <FormBufferProvider>
      <CommentBufferProvider>
        <NavBar>
          {user.isAdmin ? <AdminView user={user} /> : <UserView user={user} />}
        </NavBar>
      </CommentBufferProvider>
    </FormBufferProvider>
  );
};

export default Home;
