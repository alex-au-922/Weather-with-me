import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";
import resourceFetch from "../authUtils/resourceFetch";

const parseUserDataFrontendView = (userJson) => {
  const userList = userJson
    .filter((obj) => obj.role !== "admin")
    .map((obj) => {
      const newUserObject = { ...obj };
      delete newUserObject.role;
      return newUserObject;
    });
  return userList;
};

const initFetchUserData = async () => {
  const response = {
    success: false,
    error: null,
    errorType: null,
    result: null,
    invalidated: null,
  };
  const userDataURL = `${BACKEND_WEBSERVER_HOST}/user`;
  const userDataPayload = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: localStorage.getItem("accessToken"),
    }),
  };

  try {
    const { success, error, errorType, result, invalidated } =
      await resourceFetch(userDataURL, userDataPayload);
    if (success) {
      response.success = true;
      response.result = result;
    } else {
      response.error = error;
      response.errorType = errorType;
      response.invalidated = invalidated;
    }
  } catch (error) {
    response.error = error;
    response.errorType = "UNKNOWN_ERROR";
  } finally {
    return response;
  }
};

export default parseUserDataFrontendView;
export { initFetchUserData };
