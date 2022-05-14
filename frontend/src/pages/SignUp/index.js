import React, { useState, useContext } from "react";
import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";
import checkString from "../../utils/input/checkString";
import { Form, Card, Button } from "react-bootstrap";
import { FormInputWithError } from "../../utils/gui/formInputs";
import { useNavigate } from "react-router-dom";
import { objectSetAll } from "../../utils/object";
import validateEmail from "../../utils/input/checkEmail";
import { FetchStateContext } from "../../middleware/fetch";
import { REDIRECT_TIME } from "../../frontendConfig";
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
  const { fetchFactory } = useContext(FetchStateContext);
  const createFetch = fetchFactory(
    {
      success: true,
      loading: true,
      error: true,
    },
    `Successfully created user ${userInfo.username}!`,
    null
  );

  const navigate = useNavigate();
  const createNewUser = async () => {
    const bufferError = objectSetAll(error, false);

    const { username, password, confirmedPassword, email } = userInfo;
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
    if (email) {
      const emailCheckResult = validateEmail(email);
      if (!emailCheckResult.success) {
        setError({
          ...bufferError,
          email: emailCheckResult.error,
        });
        return;
      }
    }
    const url = `${BACKEND_WEBSERVER_HOST}/api/v1/signup`;
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    };
    const {
      success: signupSuccess,
      error: signupError,
      errorType: signupErrorType,
      fetching: signupFetching,
      result: signupResult,
    } = await createFetch(url, payload);
    if (!signupFetching) {
      if (!signupSuccess) {
        if (signupErrorType === "UsernameError") {
          setError({ ...bufferError, username: signupError });
          return;
        } else if (signupErrorType === "PasswordError") {
          setError({ ...bufferError, password: signupError });
          return;
        } else if (signupErrorType === "EmailError") {
          setError({ ...bufferError, email: signupError });
          return;
        }
      } else {
        const { refreshToken, accessToken } = signupResult;
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("accessToken", accessToken);
        setTimeout(() => {
          navigate("/login");
        }, REDIRECT_TIME);
      }
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
                    email: event.target.value,
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
