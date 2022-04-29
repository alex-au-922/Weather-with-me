import Home from "../pages/Home";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPw";
import ResetPasswordEmail from "../pages/ResetPwEmail";
import ResetPasswordSuccess from "../pages/ResetPwSuccess";
import ResetPasswordEmailSuccess from "../pages/ResetPwEmailSuccess";
import SignUp from "../pages/SignUp";
import SignUpSuccess from "../pages/SignUpSuccess";

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
    protected: true,
  },
  {
    path: "/reset/email/success",
    component: <ResetPasswordEmailSuccess />,
    protected: true,
  },
  {
    path: "/signup/success",
    component: <SignUpSuccess />,
    protected: true,
  },
];
export default routes;
