import React, { useState } from "react";
import { Form, Card, Button } from "react-bootstrap";
import FormInputWithError from "../../utils/gui/formInputs";
import checkString from "../../utils/input/checkString";
import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";
import { AuthContext } from "../../middleware/auth";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import objectSetAll from "../../utils/setAll";

const Login = () => {
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });
  const [error, setError] = useState({ username: false, password: false });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateLogin = async () => {
    const bufferError = objectSetAll(error, false);

    const { username, password } = userInfo;
    const usernameCheckResult = checkString(username);
    const passwordCheckResult = checkString(password);

    if (!usernameCheckResult.success) {
      setError({ ...bufferError, username: usernameCheckResult.error });
      return;
    }
    if (!passwordCheckResult.success) {
      setError({ ...bufferError, password: passwordCheckResult.error });
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
    const result = await fetch(url, payload);
    const {
      success,
      errorType,
      error: errorMessage,
      result: loginResult,
    } = await result.json();
    if (!success) {
      if (errorType === "UNKNOWN_ERROR") {
        console.log("Unknown error occurs!");
        return;
      } else if (errorType === "username") {
        setError({ ...bufferError, username: errorMessage });
        return;
      }
      setError({ ...bufferError, password: errorMessage });
      return;
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
              <div
                style={{ height: "50%" }}
                className="d-flex justify-content-center"
              >
                <img src="sun.png" alt="sun" />
              </div>
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
