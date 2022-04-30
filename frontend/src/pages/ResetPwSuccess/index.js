import { useContext, useEffect } from "react";
import { AuthContext } from "../../middleware/auth";
import { REDIRECT_TIME } from "../../frontendConfig";
const ResetPasswordSuccess = () => {
  const { login } = useContext(AuthContext);
  useEffect(() => {
    setTimeout(() => {
      login();
    }, REDIRECT_TIME);
  }, []);
  return <div>Reset Password Successful!</div>;
};

export default ResetPasswordSuccess;
