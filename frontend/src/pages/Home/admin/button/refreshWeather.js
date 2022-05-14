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
