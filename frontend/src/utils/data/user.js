import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";
import resourceFetch from "../authUtils/resourceFetch";

const parseUserDataFrontendView = (userJson) => {
  const userList = userJson
    .filter((obj) => obj.role !== "admin")
    .map((obj) => {
      const newUserObject = { ...obj };
      delete newUserObject.role;
      newUserObject.favouriteLocation = newUserObject.favouriteLocation.map(
        (geolocationObj) => geolocationObj.name
      );
      return newUserObject;
    });
  return userList;
};

const initFetchUserData = async (fetchFunction = fetch) => {
  const response = {
    success: false,
    error: null,
    errorType: null,
    result: null,
    invalidated: null,
    fetching: false,
  };
  const userDataURL = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/user/user`;
  const userDataPayload = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("accessToken"),
    },
  };

  try {
    const { success, error, errorType, result, invalidated, fetching } =
      await resourceFetch(fetchFunction, userDataURL, userDataPayload);
    response.fetching = fetching;
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
    response.errorType = "UnknownError";
  } finally {
    return response;
  }
};

export default parseUserDataFrontendView;
export { initFetchUserData };
