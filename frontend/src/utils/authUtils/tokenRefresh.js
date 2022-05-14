import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";

const tokensRefresh = async (fetchFunction = fetch) => {
  const response = {
    success: false,
    error: null,
    errorType: null,
    accessToken: null,
    fetching: false,
  };

  // validate refresh token to bypass login
  const validateRefreshTokenURL = `${BACKEND_WEBSERVER_HOST}/api/v1/token/refresh`;
  const validateRefreshTokenPayload = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authentication: localStorage.getItem("refreshToken"),
    },
  };
  // get the payload from the backend
  const { success, result, error, errorType, fetching } = await fetchFunction(
    validateRefreshTokenURL,
    validateRefreshTokenPayload
  );
  if (fetching) {
    response.fetching = fetching;
    return response;
  }

  if (!success) {
    response.error = error;
    response.errorType = errorType;
    return response;
  }
  const { refreshToken, accessToken } = result;
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("accessToken", accessToken);
  response.success = true;
  response.accessToken = accessToken;
  return response;
};

export default tokensRefresh;
