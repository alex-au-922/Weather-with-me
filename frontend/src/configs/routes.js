import Home from "../pages/Home";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPw";
import ResetPasswordEmail from "../pages/ResetPwEmail";
import ResetPasswordSuccess from "../pages/ResetPwSuccess";
import ResetPasswordEmailSuccess from "../pages/ResetPwEmailSuccess";
import SignUp from "../pages/SignUp";
import SignUpSuccess from "../pages/SignUpSuccess";
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
    path: "/reset/success",
    component: <ResetPasswordSuccess />,
    protected: false,
  },
  {
    path: "/reset/email/success",
    component: <ResetPasswordEmailSuccess />,
    protected: false,
  },
  {
    path: "/signup/success",
    component: <SignUpSuccess />,
    protected: false,
  },
  {
    path: "/settings",
    component: <Settings />,
    protected: true,
  }
];
export default routes;
