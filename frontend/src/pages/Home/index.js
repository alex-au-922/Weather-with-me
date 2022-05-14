//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import { useContext, useReducer } from "react";
import { AuthContext } from "../../middleware/auth";
import { FormBufferProvider } from "./admin/contexts/formBufferProvider";
import { CommentBufferProvider } from "./user/contexts/commentBufferProvider";
import { FavouriteLocation } from "./user/button/favouriteLocation";
import { RefreshWeather } from "./admin/button/refreshWeather";
import AdminView from "./admin";
import UserView from "./user";
import NavBar from "../../wrapper/navbar";

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
    <>
      {user.isAdmin ? (
        <NavBar renderButton={adminRenderButton} buttonOnClick={() => {}}>
          <AdminView/>
        </NavBar>
      ) : (
        <NavBar
          renderButton={userRenderButton}
          buttonOnClick={toggleShowFavourite}
        >
          <UserView showFavourite={showFavourite} />
        </NavBar>
      )}
    </>
  );
};

export default Home;
