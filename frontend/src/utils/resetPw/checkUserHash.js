import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";
import unixTimeExpired from "../time/unixExpired";

const findUserHash = async (userHash) => {
  // Decrypt the jwt
  const endPoint = `${BACKEND_WEBSERVER_HOST}/userhash`;
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userHash }),
  };

  // Fetch the userhash
  const apiResult = await fetch(endPoint, payload);
  const { success, error, userInfo } = await apiResult.json();
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
