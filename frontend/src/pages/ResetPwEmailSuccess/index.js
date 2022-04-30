import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { REDIRECT_TIME } from "../../frontendConfig";
const ResetPasswordEmailSuccess = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/login");
    }, REDIRECT_TIME);
  }, []);
  return (
    <div>
      A confirmation email will be sent to the email if the email is
      authenticated.
    </div>
  );
};

export default ResetPasswordEmailSuccess;
