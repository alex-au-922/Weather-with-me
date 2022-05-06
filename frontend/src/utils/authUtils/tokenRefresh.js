import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";

const tokensRefresh = async () => {
  const response = {
    success: false,
    error: null,
    errorType: null,
  };
  const localRefreshToken = localStorage.getItem("refreshToken");

  // validate refresh token to bypass login
  const validateRefreshTokenURL = `${BACKEND_WEBSERVER_HOST}/token/refresh`;
  const validateRefreshTokenPayload = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken: localRefreshToken }),
  };

  // get the payload from the backend
  const validateRefreshTokenResult = await fetch(
    validateRefreshTokenURL,
    validateRefreshTokenPayload
  );

  const { success, result, error, errorType } =
    await validateRefreshTokenResult.json();
  if (!success) {
    response.error = error;
    response.errorType = errorType;
    return response;
  }
  const { refreshToken, accessToken } = result;
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("accessToken", accessToken);
  response.success = true;
  return response;
};

export default tokensRefresh;
