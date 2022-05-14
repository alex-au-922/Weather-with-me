//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import Home from "../pages/Home";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPw";
import ResetPasswordEmail from "../pages/ResetPwEmail";
import SignUp from "../pages/SignUp";
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
