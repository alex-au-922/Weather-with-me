//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import React, { useState, useEffect, useContext } from "react";
import { Form, Card, Button } from "react-bootstrap";
import { FullScreenLoading } from "../../utils/gui/loading";
import { useParams, useNavigate } from "react-router-dom";
import { FetchStateContext } from "../../middleware/fetch";
import checkString from "../../utils/input/checkString";
import "bootstrap/dist/css/bootstrap.min.css";
import { BACKEND_WEBSERVER_HOST, REDIRECT_TIME } from "../../frontendConfig";
import { objectSetAll } from "../../utils/object";
import { FormInputWithError } from "../../utils/gui/formInputs";

const ResetPassword = () => {
  const { userHash } = useParams();
  const { fetchFactory } = useContext(FetchStateContext);
  const [validating, setValidating] = useState(true);
  const [userInfo, setUserInfo] = useState({
    password: "",
    confirmedPassword: "",
  });
  const [error, setError] = useState({
    password: false,
    confirmedPassword: false,
  });

  const validateFetch = fetchFactory({
    success: false,
    loading: false,
    error: true,
  });

  const updateFetch = fetchFactory(
    {
      success: true,
      loading: true,
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
    const { password, confirmedPassword } = userInfo;
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
      body: JSON.stringify({ password }),
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
        const noError = objectSetAll(error, "");
        setError({ ...noError });
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
    <div className="d-flex justify-content-center" style={{ height: "100vh" }}>
      <div className="d-flex align-items-center">
        <Card style={{ width: "25rem", height: "20rem" }}>
          <Card.Body>
            <div
              style={{ height: "20%", marginBottom: "5%" }}
              className="d-flex justify-content-center align-items-center"
            >
              <Card.Title style={{ fontSize: "25px" }}>
                Input your new password
              </Card.Title>
            </div>
            <Form style={{ height: "60%" }}>
              <div style={{ height: "50%" }}>
                <FormInputWithError
                  type="password"
                  placeholder="Password"
                  onChange={(event) =>
                    setUserInfo({ ...userInfo, password: event.target.value })
                  }
                  error={error.password}
                />
              </div>
              <div style={{ height: "50%" }}>
                <FormInputWithError
                  type="password"
                  placeholder="Confirm Password"
                  onChange={(event) =>
                    setUserInfo({
                      ...userInfo,
                      confirmedPassword: event.target.value,
                    })
                  }
                  error={error.confirmedPassword}
                />
              </div>
            </Form>
            <div style={{ height: "20%" }}>
              <Button
                style={{ width: "100%", height: "70%" }}
                variant="primary"
                onClick={handleSetNewPw}
              >
                Set New Password
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
