//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import React, { useState, useContext, useReducer, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { AuthContext } from "../../middleware/auth";
import { FetchStateContext } from "../../middleware/fetch";
import NavBar from "../../wrapper/navbar";
import SwitchButton from "../../utils/gui/switch";
import { Container } from "react-bootstrap";
import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";
import validateEmail from "../../utils/input/checkEmail";
import resourceFetch from "../../utils/authUtils/resourceFetch";
import { FormRowHeader, FormInputWithError } from "../../utils/gui/formInputs";

const Settings = () => {
  const { user } = useContext(AuthContext);
  const { fetchFactory } = useContext(FetchStateContext);
  const [unsaved, setUnsaved] = useState({
    email: "",
    viewMode: "",
  });
  const [error, setError] = useState({
    email: "",
    viewMode: "",
  });

  const [email, setEmail] = useState(user.email);
  const [viewMode, setViewMode] = useState(user.viewMode);

  const handleToggleViewMode = () => {
    setViewMode((viewMode) => (viewMode === "default" ? "dark" : "default"));
  };

  const emailUpdateFetch = fetchFactory(
    {
      success: true,
      error: true,
      loading: true,
    },
    "Successfully updated the email!",
    false,
    ["EmailError", "InvalidAccessTokenError"]
  );

  const viewModeUpdateFetch = fetchFactory(
    {
      success: true,
      error: true,
      loading: true,
    },
    "Successfully updated the view mode!",
    false,
    ["InvalidAccessTokenError"]
  );

  const onChangeEmail = (event) => {
    const newEmailInput = event.target.value;
    setEmail(newEmailInput);
  };

  useEffect(() => {
    setEmail(user.email);
    setViewMode(user.viewMode);
  }, [user]);

  useEffect(() => {
    setUnsaved({
      email: email !== user.email,
      viewMode: viewMode !== user.viewMode,
    });
  }, [email, viewMode, user]);

  const onSubmitEmail = async () => {
    if (!unsaved.email) return;
    const api = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/user/user`;
    const payload = {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("accessToken"),
        username: user.username,
      },
      body: JSON.stringify({
        email,
      }),
    };
    const { success: emailValidateSuccess, error: emailValidateError } =
      validateEmail(email);
    if (!emailValidateSuccess) {
      setError({
        ...error,
        email: emailValidateError,
      });
    } else {
      const {
        success: updateEmailSuccess,
        error: updateEmailError,
        errorType: updateEmailErrorType,
        fetching: updateEmailFetching,
      } = await resourceFetch(emailUpdateFetch, api, payload);
      if (!updateEmailFetching) {
        if (updateEmailSuccess) {
          setError({
            ...error,
            email: "",
          });
        } else if (updateEmailErrorType === "EmailError") {
          setError({
            ...error,
            email: updateEmailError,
          });
        }
      }
    }
  };

  const onSaveMode = async () => {
    if (!unsaved.viewMode) return;
    const api = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/user/user`;
    const payload = {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("accessToken"),
        username: user.username,
      },
      body: JSON.stringify({
        viewMode,
      }),
    };
    const { success: updateViewModeSuccess, fetching: updateViewModeFetching } =
      await resourceFetch(viewModeUpdateFetch, api, payload);
    if (!updateViewModeFetching) {
      if (updateViewModeSuccess) {
        setError({
          ...error,
          viewMode: "",
        });
      }
    }
  };

  return (
    <>
      <NavBar>
        <Container style={{ justifyContent: "center" }}>
          <h2>Email Setting</h2>
          <Form>
            <Form.Group>
              <FormRowHeader field={"Email Address"} updated={unsaved.email} />
              <FormInputWithError
                type="email"
                placeholder="Enter your email"
                onChange={onChangeEmail}
                value={email}
                error={error.email}
                required
              />
              <Button
                className="my-2"
                variant="outline-success"
                onClick={onSubmitEmail}
              >
                {user.email ? "Change Email" : "Bind Email"}
              </Button>
            </Form.Group>
          </Form>
          <hr />
          <FormRowHeader field={"View Mode"} updated={unsaved.viewMode} />
          <SwitchButton
            type="button"
            active={viewMode === "default"}
            clicked={handleToggleViewMode}
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
