import React, { useState, useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { AuthContext } from "../../middleware/auth";
import NavBar from "../../components/navbar";
import { Container } from "react-bootstrap";
import checkString from "../../utils/input/checkString";
import resourceFetch from "../../utils/authUtils/resourceFetch";
import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";
import SuccessfulModal from "../../utils/gui/modals/successfulModal";
import ErrorModal from "../../utils/gui/modals/errorModal";
import FormInputWithError from "../../utils/gui/formInputs";
import { FormRowHeader } from "../../utils/gui/formInputs";

const ChangePassword = () => {
  const { user } = useContext(AuthContext);
  const [userInvalidated, setUserInvalidated] = useState(false);
  const [unsaved, setUnsaved] = useState({
    password: false,
    repassword: false,
  });
  const [userInfo, setUserInfo] = useState({
    password: "",
    repassword: "",
  });
  const [updateInfo, setUpdateInfo] = useState({
    password: { success: null, error: null, errorType: null },
    repassword: { success: null, error: null, errorType: null },
    system: { success: null, error: null, errorType: null },
  });
  const [showModals, setShowModals] = useState({
    success: false,
    error: false,
  });

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
    const {
      success: passwordCheckSuccess,
      error: passwordCheckError,
      errorType: passwordCheckErrorType,
    } = checkString(password);
    if (!passwordCheckSuccess) {
      setUpdateInfo({
        ...updateInfo,
        password: {
          success: false,
          error: passwordCheckError,
          errorType: passwordCheckErrorType,
        },
      });
      return;
    }
    if (password !== repassword) {
      setUpdateInfo({
        ...updateInfo,
        repassword: {
          success: false,
          error: "The re-entered password is incorrect",
          errorType: "INVALID_INPUT",
        },
      });
      return;
    }

    const api = `${BACKEND_WEBSERVER_HOST}/resetpw`;
    const accessToken = localStorage.getItem("accessToken");
    const username = user.username;
    const payload = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        accessToken,
      }),
    };
    const { success, error, errorType, invalidated } = await resourceFetch(
      api,
      payload
    );
    if (success) {
      setUserInfo({
        password: "",
        repassword: "",
      });
      handleShowSuccessModal();
    } else {
      if (errorType === "password") {
        setUpdateInfo({
          ...updateInfo,
          password: { success, error: error || "", errorType },
        });
      } else {
        setUpdateInfo({
          ...updateInfo,
          system: { success, error: error || "", errorType },
        });
        handleShowErrorModal();
      }
    }
    setUserInvalidated(invalidated);
  };
  const handleShowSuccessModal = () =>
    setShowModals({
      ...showModals,
      success: true,
    });
  const handleCloseSuccessModal = () =>
    setShowModals({
      ...showModals,
      success: false,
    });
  const handleShowErrorModal = () =>
    setShowModals({
      ...showModals,
      error: true,
    });
  const handleCloseErrorModal = () =>
    setShowModals({
      ...showModals,
      error: false,
    });

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
                error={updateInfo.password.error}
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
                error={updateInfo.repassword.error}
                required
              />
            </Form.Group>
            <Button variant="outline-success" onClick={onSubmitPw}>
              Change Password
            </Button>
          </Form>
        </Container>
      </NavBar>
      <SuccessfulModal
        show={showModals.success}
        onHide={handleCloseSuccessModal}
        title={"Success"}
        body={"Password changed successfully."}
      />
      <ErrorModal
        show={showModals.error}
        onHide={handleCloseErrorModal}
        errorType={updateInfo.system.errorType}
        errorMessage={updateInfo.system.error}
      />
    </>
  );
};

export default ChangePassword;