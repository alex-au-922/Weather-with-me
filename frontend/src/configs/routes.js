import Home from "../pages/Home";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPw";
import ResetPasswordSuccess from "../pages/ResetPwSuccess";
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
    path: "/reset",
    component: <ResetPassword />,
    protected: false,
  },
  {
    path: "/reset/success",
    component: <ResetPasswordSuccess />,
    protected: false,
  },
  {
    path: "/signup/success",
    component: <SignUpSuccess />,
    protected: false,
  },
];
export default routes;
