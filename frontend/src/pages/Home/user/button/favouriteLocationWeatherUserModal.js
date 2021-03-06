//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

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
  const favouriteLocationFetch = fetchFactory(
    {
      loading: true,
      success: false,
      error: true,
    },
    "",
    false,
    ["InvalidAccessTokenError"]
  );

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
          action: showFavourite.current ? "add" : "delete"
        }
      })
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
          style={{ color: "#F6BE00", width: "30", height: "30" }}
        />
      ) : (
        <StarIcon
          data-toggle="tooltip"
          title="Show Favourite Locations"
          onClick={handleClick}
          style={{ color: "#777", width: "30", height: "30" }}
        />
      )}
    </div>
  );
};

export { FavouriteLocationWeatherUserModal };
