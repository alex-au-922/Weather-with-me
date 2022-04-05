import React, { useState } from "react";
import { Form, Card, Button } from "react-bootstrap";
import checkString from "../../utils/checkString";
import BACKEND_HOST from "../../frontendConfig";
import { AuthContext } from "../../middleware/auth";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });
  const [error, setError] = useState({ username: false, password: false });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateLogin = async () => {
    const { username, password } = userInfo;
    const usernameCheckResult = checkString(username);
    const passwordCheckResult = checkString(password);
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
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>Weathering with me</Card.Title>
        <Form>
          <Form.Control
            type="text"
            placeholder="Username"
            onChange={(event) =>
              setUserInfo({ ...userInfo, username: event.target.value })
            }
          />
          <Form.Control
            type="text"
            placeholder="Password"
            onChange={(event) =>
              setUserInfo({ ...userInfo, password: event.target.value })
            }
          />
        </Form>
        <Button variant="primary" onClick={validateLogin}>
          Login
        </Button>
        <Button variant="primary" onClick={() => navigate("/signup")}>
          Create New User
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Login;
