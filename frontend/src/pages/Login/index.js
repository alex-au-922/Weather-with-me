import React, { useState } from "react";
import { Form, Card, Button } from "react-bootstrap";
import checkString from "../../utils/checkString";
import { BACKEND_HOST } from "../../frontendConfig";
import { AuthContext } from "../../middleware/auth";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

const Login = () => {
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });
  const [error, setError] = useState({ username: false, password: false });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateLogin = async () => {
    const { username, password } = userInfo;
    const usernameCheckResult = checkString(username);
    const passwordCheckResult = checkString(password);
    //TODO: set all error to false before checking
    //TODO; output error message
    //const bufferError = { ...error };
    //setError({ username: false, password: false });
    if (!usernameCheckResult.success) {
      setError({ ...error, username: usernameCheckResult.error });
      return;
    }
    if (!passwordCheckResult.success) {
      setError({ ...error, password: passwordCheckResult.error });
      return;
    }
    const url = `${BACKEND_HOST}/login`;
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    };
    const result = await fetch(url, payload);
    const resultJson = await result.json();
    if (!resultJson.success) {
      if (resultJson.errorType === null) {
        console.log("Unknown error occurs!");
        return;
      } else if (resultJson.errorType === "username") {
        setError({ ...error, username: resultJson.error });
        return;
      }
      setError({ ...error, password: resultJson.error });
      return;
    } else {
      const token = resultJson.token;
      localStorage.setItem("token", token);
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
              <Form.Control
                style={{ height: "25%", marginBottom: "5%" }}
                type="text"
                className={error.username ? "is-invalid" : ""}
                placeholder="Username"
                onChange={(event) =>
                  setUserInfo({ ...userInfo, username: event.target.value })
                }
              />
              <Form.Control
                style={{ height: "25%", marginTop: "5%" }}
                type="password"
                className={error.password ? "is-invalid" : ""}
                placeholder="Password"
                onChange={(event) =>
                  setUserInfo({ ...userInfo, password: event.target.value })
                }
              />
              <div className="d-flex justify-content-end">
                <Button
                  style={{ marginTop: "1%" }}
                  variant="light"
                  className="d-flex justify-content-end btn-sm"
                  onClick={() => navigate("/forgetpassword")}
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
