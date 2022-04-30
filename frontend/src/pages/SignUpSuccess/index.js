import { useContext, useEffect } from "react";
import { AuthContext } from "../../middleware/auth";
import { REDIRECT_TIME } from "../../frontendConfig";
const SignUpSuccess = () => {
  const { login } = useContext(AuthContext);
  useEffect(() => {
    setTimeout(() => {
      login();
    }, REDIRECT_TIME);
  }, []);
  return <div>Sign up successful!</div>;
};

export default SignUpSuccess;
