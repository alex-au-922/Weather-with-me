import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";
import resourceFetch from "../authUtils/resourceFetch";
import sortOnKey from "../sortOnKey";

const parseUserDataFrontendView = (userJson) => {
  const userList = userJson
    .filter((obj) => obj.role !== "admin")
    .map((obj) => {
      const newUserObject = { ...obj };
      delete newUserObject.role;
      return newUserObject;
    });
  const newUserList = sortOnKey(userList, "username", true);
  return newUserList;
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
    console.log(success, error, errorType, result, invalidated, fetching);
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
