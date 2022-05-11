import { useContext, useReducer } from "react";
import { AuthContext } from "../../middleware/auth";
import { FormBufferProvider } from "./admin/contexts/formBufferProvider";
import { CommentBufferProvider } from "./user/contexts/commentBufferProvider";
import { FavouriteLocation } from "./user/button/favouriteLocation";
import { RefreshWeather } from "./admin/button/refreshWeather";
import AdminView from "./admin";
import UserView from "./user";
import NavBar from "../../components/navbar";

const renderButton = (ButtonComponent) => {
  return (onClick) => <ButtonComponent onClick={onClick} />;
};

const Home = () => {
  const { user } = useContext(AuthContext);
  const [showFavourite, toggleShowFavourite] = useReducer(
    (bool) => !bool,
    false
  );
  const userRenderButton = renderButton(FavouriteLocation);
  const adminRenderButton = renderButton(RefreshWeather);

  return (
    <FormBufferProvider>
      <CommentBufferProvider>
        {user.isAdmin ? (
          <NavBar renderButton={adminRenderButton} buttonOnClick={() => {}}>
            <AdminView user={user} />
          </NavBar>
        ) : (
          <NavBar
            renderButton={userRenderButton}
            buttonOnClick={toggleShowFavourite}
          >
            <UserView user={user} showFavourite={showFavourite} />
          </NavBar>
        )}
      </CommentBufferProvider>
    </FormBufferProvider>
  );
};

export default Home;
