import React, { useState } from "react";
import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";
import checkString from "../../utils/input/checkString";
import { Form, Card, Button } from "react-bootstrap";
import FormInputWithError from "../../utils/gui/formInputError";
import { useNavigate } from "react-router-dom";
import objectSetAll from "../../utils/setAll";
const SignUp = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    confirmedPassword: "",
    email: "",
  });
  const [error, setError] = useState({
    username: false,
    password: false,
    confirmedPassword: false,
    email: false,
  });

  const navigate = useNavigate();
  const createNewUser = async () => {
    const bufferError = objectSetAll(error, false);

    const { username, password, confirmedPassword } = userInfo;
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
    if (confirmedPassword !== password) {
      setError({
        ...bufferError,
        confirmedPassword: "Passwords are not the same!",
      });
      return;
    }
    const url = `${BACKEND_WEBSERVER_HOST}/signup`;
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
        setError({ ...bufferError, username: resultJson.error });
        return;
      }
    } else {
      const token = resultJson.token;
      localStorage.setItem("token", token);
      navigate("/signup/success");
    }
  };

  return (
    <div className="d-flex justify-content-center" style={{ height: "100vh" }}>
      <div className="d-flex align-items-center">
        <Card style={{ width: "25rem", height: "40rem" }}>
          <Card.Body>
            <div
              style={{ height: "10%", marginBottom: "5%" }}
              className="d-flex justify-content-center align-items-center"
            >
              <Card.Title style={{ fontSize: "25px" }}>
                Create Account
              </Card.Title>
            </div>
            <Form style={{ height: "60%" }}>
              <FormInputWithError
                style={{ width: "100%", height: "15%", marginBottom: "5%" }}
                type="text"
                placeholder="Username"
                onChange={(event) =>
                  setUserInfo({ ...userInfo, username: event.target.value })
                }
                error={error.username}
              />
              <FormInputWithError
                type="password"
                style={{ width: "100%", height: "15%", marginBottom: "5%" }}
                placeholder="Password"
                onChange={(event) =>
                  setUserInfo({ ...userInfo, password: event.target.value })
                }
                error={error.password}
              />
              <FormInputWithError
                type="password"
                style={{ width: "100%", height: "15%", marginBottom: "5%" }}
                placeholder="Confirm Password"
                onChange={(event) =>
                  setUserInfo({
                    ...userInfo,
                    confirmedPassword: event.target.value,
                  })
                }
                error={error.confirmedPassword}
              />
              <Form.Control
                type="text"
                style={{ width: "100%", height: "15%" }}
                placeholder="Email (Optional) "
                onChange={(event) =>
                  setUserInfo({
                    ...userInfo,
                    confirmedPassword: event.target.value,
                  })
                }
              />
            </Form>
            <div style={{ height: "20%" }}>
              <Button
                style={{ width: "100%", height: "40%" }}
                variant="primary"
                onClick={createNewUser}
              >
                Create
              </Button>
            </div>
            <div
              style={{ height: "7%" }}
              className="d-flex justify-content-end"
            >
              <Button variant="light" onClick={() => navigate("/login")}>
                Back
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
