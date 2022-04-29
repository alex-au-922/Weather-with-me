import { BACKEND_HOST } from "../../frontendConfig";
import sleep from "../time/sleep";
import unixTimeExpired from "../time/unixExpired";

const decryptJwt = async () => {
  const token = localStorage.getItem("token");
  //Better user experience if the loading is slower
  await sleep(1000);

  // If no JWT in the localStorage
  if (token === null) {
    return { success: false, error: "No token found!", expried: null };
  }

  // Decrypt the jwt
  const endPoint = `${BACKEND_HOST}/decrypt`;
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  };

  // Fetch the decryption of JWT
  const apiResult = await fetch(endPoint, payload);
  const { success, result } = await apiResult.json();
  if (!success) {
    return { success: false, error: null, result: null };
  } else {
    const expired = unixTimeExpired(result.exp);
    const decryptedResult = {
      username: result.username,
      role: result.role,
      email: result.email,
      viewMode: result.viewMode,
      expired: expired,
    };
    return { success: true, error: null, result: decryptedResult };
  }
};

export default decryptJwt;
