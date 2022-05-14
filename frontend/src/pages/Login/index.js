//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import React, { useState, useContext } from "react";
import { Form, Card, Button } from "react-bootstrap";
import { FormInputWithError } from "../../utils/gui/formInputs";
import checkString from "../../utils/input/checkString";
import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";
import { AuthContext } from "../../middleware/auth";
import { FetchStateContext } from "../../middleware/fetch";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { objectSetAll } from "../../utils/object";

const Login = () => {
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });
  const [error, setError] = useState({ username: false, password: false });
  const { login } = useContext(AuthContext);
  const { fetchFactory } = useContext(FetchStateContext);
  const loginFetch = fetchFactory(
    {
      success: false,
      error: true,
      loading: true,
    },
    null,
    false,
    ["UsernameError", "PasswordError"]
  );
  const navigate = useNavigate();

  const validateLogin = async () => {
    const bufferError = objectSetAll(error, false);

    const { username, password } = userInfo;
    const { success: usernameCheckSuccess, error: usernameCheckError } =
      checkString(username);
    const { success: passwordCheckSuccess, error: passwordCheckError } =
      checkString(password);

    if (!usernameCheckSuccess) {
      setError({ ...bufferError, username: usernameCheckError });
      return;
    }
    if (!passwordCheckSuccess) {
      setError({ ...bufferError, password: passwordCheckError });
      return;
    }
    const url = `${BACKEND_WEBSERVER_HOST}/api/v1/login`;
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userInfo,
      }),
    };
    const {
      success: loginSuccess,
      errorType: loginErrorType,
      error: loginErrorMessage,
      result: loginResult,
    } = await loginFetch(url, payload);
    if (!loginSuccess) {
      if (loginErrorType === "UsernameError") {
        setError({ ...bufferError, username: loginErrorMessage });
        return;
      } else if (loginErrorType === "PasswordError") {
        setError({ ...bufferError, password: loginErrorMessage });
        return;
      }
    } else {
      const { refreshToken, accessToken } = loginResult;
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("accessToken", accessToken);
      login();
    }
  };

  return (
    <div className="d-flex justify-content-center" style={{ height: "100vh" }}>
      <div className="d-flex align-items-center">
        <Card style={{ width: "25rem", height: "40rem" }}>
          <Card.Body>
            <div style={{ height: "20%" }}>
              <Card.Title
                className="d-flex justify-content-center align-items-center"
                style={{ height: "50%", fontSize: "25px" }}
              >
                Weathering with me
              </Card.Title>
            </div>
            <Form style={{ height: "40%" }}>
              <div style={{ height: "10%" }} />
              <FormInputWithError
                style={{ height: "25%", marginBottom: "5%" }}
                type="text"
                placeholder="Username"
                onChange={(event) =>
                  setUserInfo({ ...userInfo, username: event.target.value })
                }
                error={error.username}
              />

              <FormInputWithError
                style={{ height: "25%", marginTop: "5%" }}
                type="password"
                placeholder="Password"
                onChange={(event) =>
                  setUserInfo({ ...userInfo, password: event.target.value })
                }
                error={error.password}
              />
              <div className="d-flex justify-content-end">
                <Button
                  style={{ marginTop: "1%" }}
                  variant="light"
                  className="d-flex justify-content-end btn-sm"
                  onClick={() => navigate("/reset/email")}
                >
                  Forget Password?
                </Button>
              </div>
            </Form>
            <div style={{ height: "40%" }}>
              <div
                style={{ height: "40%" }}
                className="d-flex justify-content-center align-items-center"
              >
                <Button
                  style={{ width: "80%", height: "50%" }}
                  variant="primary"
                  onClick={validateLogin}
                >
                  Login
                </Button>
              </div>
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "20%", fontSize: "20px" }}
              >
                {" "}
                OR{" "}
              </div>
              <div
                style={{ height: "40%" }}
                className="d-flex justify-content-center align-items-center"
              >
                <Button
                  style={{ width: "80%", height: "50%" }}
                  variant="light"
                  onClick={() => navigate("/signup")}
                >
                  Create New User
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Login;
