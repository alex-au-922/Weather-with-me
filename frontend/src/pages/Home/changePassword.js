import React, { useState, useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { AuthContext } from "../../middleware/auth";
import { FetchStateContext } from "../../middleware/fetch";
import NavBar from "../../components/navbar";
import { Container } from "react-bootstrap";
import checkString from "../../utils/input/checkString";
import resourceFetch from "../../utils/authUtils/resourceFetch";
import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";
import FormInputWithError from "../../utils/gui/formInputs";
import { FormRowHeader } from "../../utils/gui/formInputs";
import { objectSetAll } from "../../utils/object";

const ChangePassword = () => {
  const { user } = useContext(AuthContext);
  const [unsaved, setUnsaved] = useState({
    password: false,
    repassword: false,
  });
  const [userInfo, setUserInfo] = useState({
    password: "",
    repassword: "",
  });
  const [error, setError] = useState({
    password: "",
    repassword: "",
  });
  const { fetchFactory } = useContext(FetchStateContext);
  const passwordUpdateFetch = fetchFactory(
    {
      success: true,
      error: true,
      loading: true,
    },
    "Successfully updated the password!",
    false,
    ["PasswordError"]
  );
  useEffect(() => {
    setUnsaved({
      password: userInfo.password,
      repassword: userInfo.repassword,
    });
  }, [userInfo]);

  const onChangePw = (event) => {
    setUserInfo({
      ...userInfo,
      password: event.target.value,
    });
  };

  const onChangeRePw = (event) => {
    setUserInfo({
      ...userInfo,
      repassword: event.target.value,
    });
  };

  const onSubmitPw = async () => {
    const { password, repassword } = userInfo;
    const { success: passwordCheckSuccess, error: passwordCheckError } =
      checkString(password);
    if (!passwordCheckSuccess) {
      const newError = objectSetAll(error, false);
      newError.password = passwordCheckError;
      setError(newError);
      return;
    }
    if (password !== repassword) {
      const newError = objectSetAll(error, false);
      newError.repassword = "Passwords are not the same!";
      setError(newError);
      return;
    }

    const api = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/user/user`;
    const payload = {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("accessToken"),
        username: user.username,
      },
      body: JSON.stringify({
        password: userInfo.password,
      }),
    };
    const {
      success: updatePasswordSuccess,
      error: updatePasswordError,
      errorType: updatePasswordErrorType,
      fetching: updatePasswordFetching,
    } = await resourceFetch(passwordUpdateFetch, api, payload);
    if (!updatePasswordFetching) {
      if (updatePasswordSuccess) {
        const newUserInfo = objectSetAll(userInfo, "");
        const newError = objectSetAll(error, false);
        setUserInfo(newUserInfo);
        setError(newError);
      } else if (updatePasswordErrorType === "PasswordError") {
        const newUserInfo = objectSetAll(userInfo, "");
        newUserInfo.password = updatePasswordError;
        setError(newUserInfo);
      }
    }
  };

  return (
    <>
      <NavBar>
        <Container style={{ justifyContent: "center" }}>
          <h2>Password Setting</h2>
          <Form noValidate onSubmit={onSubmitPw}>
            <Form.Group className="my-3">
              <FormRowHeader
                field={"New Password"}
                updated={unsaved.password}
              />
              <FormInputWithError
                type="password"
                placeholder="Enter your new password"
                onChange={onChangePw}
                value={userInfo.password}
                error={error.password}
                required
              />
            </Form.Group>
            <Form.Group className="my-3">
              <FormRowHeader
                field={"Re-enter New Password"}
                updated={unsaved.repassword}
              />
              <FormInputWithError
                type="password"
                placeholder="Enter your new password"
                onChange={onChangeRePw}
                value={userInfo.repassword}
                error={error.repassword}
                required
              />
            </Form.Group>
            <Button variant="outline-success" onClick={onSubmitPw}>
              Change Password
            </Button>
          </Form>
        </Container>
      </NavBar>
    </>
  );
};

export default ChangePassword;
