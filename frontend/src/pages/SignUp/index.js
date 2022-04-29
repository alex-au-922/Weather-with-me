import React, { useState } from "react";
import { BACKEND_HOST } from "../../frontendConfig";
import { Form, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const [userInfo, setUserInfo] = useState({
    username: null,
    password: null,
    confirmedPassword: null,
    email: null,
  });
  const [error, setError] = useState({
    username: false,
    password: false,
    confirmedPassword: false,
    email: false,
  });
  const navigate = useNavigate();
  const createNewUser = async () => {
    //TODO: validate the user info and add appropriate errors
    const url = `${BACKEND_HOST}/signup`;
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
      } else {
        setError({ ...error, username: resultJson.error });
        return;
      }
    } else {
      const token = resultJson.token;
      localStorage.setItem("token", token);
      navigate("/signup/success");
    }
  };

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>Create Account</Card.Title>
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
          <Form.Control
            type="text"
            placeholder="Confirm Password"
            onChange={(event) =>
              setUserInfo({
                ...userInfo,
                confirmedPassword: event.target.value,
              })
            }
          />
          <Form.Control
            type="text"
            placeholder="Email"
            onChange={(event) =>
              setUserInfo({
                ...userInfo,
                email: event.target.value,
              })
            }
          />
        </Form>
        <Button variant="primary" onClick={createNewUser}>
          Login
        </Button>
      </Card.Body>
    </Card>
  );
};

export default SignUp;
