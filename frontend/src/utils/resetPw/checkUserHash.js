//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";
import unixTimeExpired from "../time/unixExpired";

const findUserHash = async (fetchFunction, userHash) => {
  // Decrypt the jwt
  const endPoint = `${BACKEND_WEBSERVER_HOST}/api/v1/${userHash}`;
  const payload = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Fetch the userhash
  const apiResult = await fetchFunction(endPoint, payload);
  const { success, error, errorType, userInfo } = await apiResult.json();
  if (!success) {
    return { success: false, error };
  } else if (userInfo === null) {
    return { success: false, error };
  } else {
    const expired = unixTimeExpired(userInfo.expiredTime);
    return { success: true, error: null, expired, userInfo };
  }
};

export default findUserHash;
