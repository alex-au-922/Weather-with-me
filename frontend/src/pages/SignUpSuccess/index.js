import { useContext, useEffect } from "react";
import { AuthContext } from "../../middleware/auth";
const SignUpSuccess = () => {
  const { login } = useContext(AuthContext);
  useEffect(() => {
    setTimeout(() => {
      login();
    }, 3000);
  }, []);
  return <div>Sign up successful!</div>;
};

export default SignUpSuccess;
