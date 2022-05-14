//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";
const tokenLogin = async (fetchFunction = fetch) => {
  const response = {
    success: false,
    error: null,
    errorType: null,
    fetching: false,
  };
  const localRefreshToken = localStorage.getItem("refreshToken");

  // validate refresh token to bypass login
  const validateRefreshTokenURL = `${BACKEND_WEBSERVER_HOST}/api/v1/login`;
  const validateRefreshTokenPayload = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      authentication: localRefreshToken,
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
  return response;
};

export default tokenLogin;
