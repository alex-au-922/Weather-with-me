import React, { useState, useEffect } from "react";
import { Form, Card, Button } from "react-bootstrap";
import { FullScreenLoading } from "../../utils/gui/loading";
import { useParams, useNavigate } from "react-router-dom";
import checkString from "../../utils/input/checkString";
import findUserHash from "../../utils/resetPw/checkUserHash";
import "bootstrap/dist/css/bootstrap.min.css";
import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";

const ResetPassword = () => {
  const { userHash } = useParams();
  const [authorized, setAuthorized] = useState(false);
  const [validating, setValidating] = useState(true);
  const [userInfo, setUserInfo] = useState({
    username: null,
    password: null,
    confirmedPassword: null,
  });
  const [error, setError] = useState({
    password: false,
    confirmedPassword: false,
  });
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      if (validating) {
        const userHashResult = await findUserHash(userHash);
        if (userHashResult.success && !userHashResult.expired) {
          setAuthorized(true);
          setUserInfo({
            ...userInfo,
            username: userHashResult.userInfo.userId.username,
          });
        }
        setValidating(false);
      }
    })();
  }, [validating]);

  const handleSetNewPw = async () => {
    const { username, password, confirmedPassword } = userInfo;
    const passwordCheckResult = checkString(password);
    if (!passwordCheckResult.success) {
      setError({ ...error, password: passwordCheckResult.error });
      return;
    }
    if (password !== confirmedPassword) {
      setError({ ...error, confirmedPassword: "Passwords are not the same!" });
      return;
    }
    const url = `${BACKEND_WEBSERVER_HOST}/resetpw`;
    const payload = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    };
    const result = await fetch(url, payload);
    const resultJson = await result.json();
    if (!resultJson.success) {
      if (resultJson.errorType === "password") {
        setError({ ...error, password: resultJson.error });
        return;
      } else console.log(resultJson.error);
    } else {
      const token = resultJson.token;
      localStorage.setItem("token", token);
      navigate("/reset/success");
    }
  };

  return (
    <>
      {validating ? (
        <FullScreenLoading />
      ) : authorized ? (
        <ResetPasswordInput
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          error={error}
          handleSetNewPw={handleSetNewPw}
        />
      ) : (
        <InvalidLinkPage />
      )}
    </>
  );
};

const InvalidLinkPage = () => {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>Invalid Link! </Card.Title>
      </Card.Body>
    </Card>
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
