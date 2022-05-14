import { useEffect, useReducer, useRef } from "react";
import { ReactComponent as StarIcon } from "./star.svg";
import { useContext } from "react";
import { AuthContext } from "../../../../middleware/auth";
import resourceFetch from "../../../../utils/authUtils/resourceFetch";
import { BACKEND_WEBSERVER_HOST } from "../../../../frontendConfig";
import { FetchStateContext } from "../../../../middleware/fetch";

const FavouriteLocationWeatherUserModal = (props) => {
  const { user } = useContext(AuthContext);
  const showFavourite = useRef(props.isFavourite);

  const { fetchFactory } = useContext(FetchStateContext);
  const favouriteLocationFetch = fetchFactory({
    loading: true,
    success: false,
    error: true,
  });

  const handleClick = async () => {
    showFavourite.current = !showFavourite.current;
    const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/user/user`;
    const payload = {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("accessToken"),
        username: user.username,
      },
      body: JSON.stringify({
        favouriteLocation: {
          name: props.name,
          action: showFavourite.current ? "add" : "delete",
        },
      }),
    };
    const { success: submitSuccess, fetching: submitFetching } =
      await resourceFetch(favouriteLocationFetch, url, payload);
  };

  return (
    <div style={{ cursor: "pointer" }}>
      {showFavourite.current ? (
        <StarIcon
          data-toggle="tooltip"
          title="Show Normal"
          onClick={handleClick}
          style={{ color: "#F6BE00", width: "24", height: "24" }}
        />
      ) : (
        <StarIcon
          data-toggle="tooltip"
          title="Show Favourite Locations"
          onClick={handleClick}
          style={{ color: "#777", width: "24", height: "24" }}
        />
      )}
    </div>
  );
};

export { FavouriteLocationWeatherUserModal };
