//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import React, { useState, useContext, useEffect } from "react";
import { Form, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  BACKEND_WEBSERVER_HOST,
  RESEND_EMAIL_TIME,
} from "../../frontendConfig";
import { FetchStateContext } from "../../middleware/fetch";

const ResetPasswordEmail = (props) => {
  const [email, setEmail] = useState();
  const [initialClick, setInitialClick] = useState(true);
  const [buttonValid, setButtonValid] = useState(true);
  const [coolDownTime, setCoolDownTime] = useState(RESEND_EMAIL_TIME);
  const { fetchFactory } = useContext(FetchStateContext);
  const emailFetch = fetchFactory(
    {
      success: true,
      loading: false,
      error: false,
    },
    `An email will be sent to your mailbox if you have binded your
    account with this email.
    `
  );
  const navigate = useNavigate();

  const handleSendResetPwEmail = async () => {
    const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resetpw`;
    const payload = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email }),
    };
    await emailFetch(url, payload);
    setInitialClick(false);
    setButtonValid(false);
    setTimeout(() => {
      setButtonValid(true);
      setCoolDownTime(RESEND_EMAIL_TIME);
    }, RESEND_EMAIL_TIME * 1000);
  };

  useEffect(() => {
    if (!buttonValid) {
      if (!coolDownTime) return;

      const intervalId = setInterval(() => {
        setCoolDownTime(coolDownTime - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [coolDownTime, buttonValid]);

  return (
    <div className="d-flex justify-content-center" style={{ height: "100vh" }}>
      <div className="d-flex align-items-center">
        <Card style={{ width: "25rem", height: "20rem" }}>
          <Card.Body>
            <div
              style={{ height: "10%", marginBottom: "5%" }}
              className="d-flex justify-content-center align-items-center"
            >
              <Card.Title style={{ fontSize: "25px" }}>
                Input your Email
              </Card.Title>
            </div>
            <Form style={{ height: "50%" }}>
              <div style={{ height: "30%" }} />
              <Form.Control
                type="text"
                placeholder="Email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </Form>
            <div style={{ height: "20%" }}>
              <Button
                style={{ width: "100%", height: "70%" }}
                variant="primary"
                disabled={!buttonValid}
                onClick={handleSendResetPwEmail}
              >
                {initialClick
                  ? "Confirm"
                  : buttonValid
                  ? "Resend Email"
                  : `Resend email in ${coolDownTime}s`}
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

export default ResetPasswordEmail;
