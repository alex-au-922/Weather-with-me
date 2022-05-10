import React, { useState, useEffect, useContext } from "react";
import { Form, Card, Button } from "react-bootstrap";
import { FullScreenLoading } from "../../utils/gui/loading";
import { useParams, useNavigate } from "react-router-dom";
import { FetchStateContext } from "../../middleware/fetch";
import checkString from "../../utils/input/checkString";
import "bootstrap/dist/css/bootstrap.min.css";
import { BACKEND_WEBSERVER_HOST, REDIRECT_TIME } from "../../frontendConfig";
import { objectSetAll } from "../../utils/object";

const ResetPassword = () => {
  const { userHash } = useParams();
  const { fetchFactory } = useContext(FetchStateContext);
  const [validating, setValidating] = useState(true);
  const [userInfo, setUserInfo] = useState({
    password: null,
    confirmedPassword: null,
  });
  const [error, setError] = useState({
    password: false,
    confirmedPassword: false,
  });

  const validateFetch = fetchFactory({
    success: false,
    showLoading: false,
    error: true,
  });

  const updateFetch = fetchFactory(
    {
      success: true,
      showLoading: true,
      error: true,
    },
    "Successfully changed password!",
    null
  );
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      if (validating) {
        const api = `${BACKEND_WEBSERVER_HOST}/api/v1/resetpw/${userHash}`;
        const payload = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
        const { success: validateSuccess, fetching: validateFetching } =
          await validateFetch(api, payload);
        if (!validateFetching) {
          if (!validateSuccess) {
            setTimeout(() => {
              navigate("/login");
            }, REDIRECT_TIME);
          }
        }
        setValidating(false);
      }
    })();
  }, [validating]);

  const handleSetNewPw = async () => {
    const { username, password, confirmedPassword } = userInfo;
    const passwordCheckResult = checkString(password);
    if (!passwordCheckResult.success) {
      const newError = objectSetAll(error, "");
      setError({ ...newError, password: passwordCheckResult.error });
      return;
    }
    if (password !== confirmedPassword) {
      const newError = objectSetAll(error, "");
      setError({
        ...newError,
        confirmedPassword: "Passwords are not the same!",
      });
      return;
    }
    const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resetpw/${userHash}`;
    const payload = {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    };
    const {
      success: resetSuccess,
      errorType: resetErrorType,
      error: resetError,
      fetching: resetFetching,
    } = await updateFetch(url, payload);
    if (!resetFetching) {
      if (!resetSuccess) {
        if (resetErrorType === "PasswordError") {
          const newError = objectSetAll(error, "");
          setError({ ...newError, password: resetError });
          return;
        }
      } else {
        setTimeout(() => {
          navigate("/login");
        }, REDIRECT_TIME);
      }
    }
  };

  return (
    <>
      {validating ? (
        <FullScreenLoading />
      ) : (
        <ResetPasswordInput
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          error={error}
          handleSetNewPw={handleSetNewPw}
        />
      )}
    </>
  );
};

const ResetPasswordInput = (props) => {
  const { userInfo, setUserInfo, error, handleSetNewPw } = props;
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>Input your </Card.Title>
        <Form>
          <Form.Control
            type="text"
            isInvalid={error.password}
            placeholder="Password"
            onChange={(event) =>
              setUserInfo({ ...userInfo, password: event.target.value })
            }
          />
          <Form.Control
            type="text"
            isInvalid={error.confirmedPassword}
            placeholder="Confirmed Password"
            onChange={(event) =>
              setUserInfo({
                ...userInfo,
                confirmedPassword: event.target.value,
              })
            }
          />
        </Form>
        <Button variant="primary" onClick={handleSetNewPw}>
          Set New Password
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ResetPassword;
