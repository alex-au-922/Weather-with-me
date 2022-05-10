import Home from "../pages/Home";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPw";
import ResetPasswordEmail from "../pages/ResetPwEmail";
import SignUp from "../pages/SignUp";
import SignUpSuccess from "../pages/SignUpSuccess";
import ChangePassword from "../pages/Home/changePassword";
import Settings from "../pages/Home/settings";

const routes = [
  {
    path: "/login",
    component: <Login />,
    protected: false,
  },
  {
    path: "/home",
    component: <Home />,
    protected: true,
  },
  {
    path: "/signup",
    component: <SignUp />,
    protected: false,
  },
  {
    path: "/reset/:userHash",
    component: <ResetPassword />,
    protected: false,
  },
  {
    path: "/reset/email",
    component: <ResetPasswordEmail />,
    protected: false,
  },
  {
    path: "/signup/success",
    component: <SignUpSuccess />,
    protected: false,
  },
  {
    path: "/changepw",
    component: <ChangePassword />,
    protected: true,
  },
  {
    path: "/settings",
    component: <Settings />,
    protected: true,
  },
];
export default routes;
