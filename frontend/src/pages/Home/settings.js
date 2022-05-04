import React, { useState, useContext, useReducer, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { AuthContext } from "../../middleware/auth";
import NavBar from "../../components/navbar";
import SwitchButton from "../../utils/gui/switch";
import { Container } from "react-bootstrap";
import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";
import validateEmail from "../../utils/input/checkEmail";
import resourceFetch from "../../utils/authUtils/resourceFetch";
import FormInputWithError from "../../utils/gui/formInputs";
import { FormRowHeader } from "../../utils/gui/formInputs";

const Settings = () => {
  const { user, logout } = useContext(AuthContext);
  const [unsaved, setUnsaved] = useState({
    email: false,
    viewMode: false,
  });
  const [userInvalidated, setUserInvalidated] = useState(false);
  const [updateInfo, setUpdateInfo] = useState({
    email: { success: null, error: null, errorType: null },
    viewMode: { success: null, error: null, errorType: null },
    system: { success: null, error: null, errorType: null },
  });
  const [currentViewMode, toggleCurrentViewMode] = useReducer((viewMode) =>
    viewMode === "default" ? "dark" : "default"
  );
  const [email, setEmail] = useState(user.email);

  const clickSwitch = () => {
    toggleCurrentViewMode();
  };

  const onChangeEmail = (event) => {
    const newEmailInput = event.target.value;
    setEmail({
      ...email,
      userEmail: newEmailInput,
    });
  };

  useEffect(() => {
    setUnsaved({
      email: email.emailInput === user.email,
      viewMode: currentViewMode === user.viewMode,
    });
  }, [email.emailInput, currentViewMode]);

  const onSubmitEmail = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const api = `${BACKEND_WEBSERVER_HOST}/setting/update`;
    const payload = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        accessToken: accessToken,
        username: user.username,
        email: email.userEmail,
      }),
    };
    const emailValid = validateEmail(email.emailInput);
    if (!emailValid) {
      const emailError = "Invalid email format!";
      const emailErrorType = "INVALID_INPUT";
      setUpdateInfo({
        ...updateInfo,
        email: { success: false, error: emailError, errorType: emailErrorType },
      });
    } else {
      const { success, error, errorType, invalidated } = await resourceFetch(
        api,
        payload
      );
      setUpdateInfo({ ...updateInfo, email: { success, error, errorType } });
      setUserInvalidated(invalidated);
    }
  };

  const onSaveMode = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const api = `${BACKEND_WEBSERVER_HOST}/setting/update`;
    const payload = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        accessToken: accessToken,
        username: user.username,
        viewMode: currentViewMode.mode,
      }),
    };
    const { success, error, errorType, invalidated } = await resourceFetch(
      api,
      payload
    );
    setUpdateInfo({ ...updateInfo, viewMode: { success, error, errorType } });
    setUserInvalidated(invalidated);
  };

  return (
    <>
      <NavBar user={user} logout={logout}>
        <Container style={{ justifyContent: "center" }}>
          <h2>Email Setting</h2>
          <Form>
            <Form.Group>
              <Form.Label>Email Address</Form.Label>
              <FormInputWithError
                type="email"
                placeholder="Enter your email"
                onChange={onChangeEmail}
                error={updateInfo.email.error}
                required
              />
              <Button
                className="my-2"
                variant="outline-success"
                onClick={onSubmitEmail}
              >
                Bind Email
              </Button>
            </Form.Group>
          </Form>
          <hr />
          <h2>View Mode Setting</h2>
          <SwitchButton
            type="button"
            active={currentViewMode === "default"}
            clicked={clickSwitch}
          ></SwitchButton>
          <Button
            className="my-2"
            variant="outline-success"
            onClick={onSaveMode}
          >
            Save Mode
          </Button>
        </Container>
      </NavBar>
    </>
  );
};

export default Settings;
