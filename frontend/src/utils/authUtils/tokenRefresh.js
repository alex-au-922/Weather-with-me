import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";

const tokensRefresh = async () => {
  const response = {
    success: false,
    error: null,
    errorType: null,
    accessToken: null,
    fetching: null,
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
  console.log("refreshing token in tokenRefresh!");
  // get the payload from the backend
  const validateRefreshTokenResult = await fetch(
    validateRefreshTokenURL,
    validateRefreshTokenPayload
  );
  console.log("get payload!");
  const { success, result, error, errorType } =
    await validateRefreshTokenResult.json();
  if (!success) {
    console.log(success, result, error, errorType);
    response.error = error;
    response.errorType = errorType;
    return response;
  }
  const { refreshToken, accessToken } = result;
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("accessToken", accessToken);
  console.log("refreshToken", refreshToken);
  console.log("accessToken", accessToken);
  response.success = true;
  response.accessToken = accessToken;
  return response;
};

export default tokensRefresh;
