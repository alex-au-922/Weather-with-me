//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import { useContext } from "react";
import { ReactComponent as RefreshIcon } from "./repeat.svg";
import { BACKEND_WEBSERVER_HOST } from "../../../../frontendConfig";
import { AuthContext } from "../../../../middleware/auth";
import { FetchStateContext } from "../../../../middleware/fetch";
import resourceFetch from "../../../../utils/authUtils/resourceFetch";
const RefreshWeather = (props) => {
  const { user } = useContext(AuthContext);
  const { fetchFactory } = useContext(FetchStateContext);
  const updateFetch = fetchFactory(
    {
      success: true,
      loading: true,
      error: true,
    },
    "Successfully updated weather data!",
    false,
    ["InvalidAccessTokenError"]
  );
  const handleClick = async () => {
    const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/admin/weathers`;
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("accessToken"),
        username: user.username,
      },
    };
    const { success: updateSuccess, fetching: updateFetching } =
      await resourceFetch(updateFetch, url, payload);
    props.onClick();
  };

  return (
    <>
      <RefreshIcon
        data-toggle="tooltip"
        title="Refresh Weather Data"
        onClick={handleClick}
        style={{ width: "24", height: "24" }}
      />
    </>
  );
};

export { RefreshWeather };
