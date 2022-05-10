import React, { useState } from "react";
import { Form, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";

const ResetPasswordEmail = (props) => {
  const [email, setEmail] = useState();
  const navigate = useNavigate();

  const handleSendResetPwEmail = async () => {
    const url = `${BACKEND_WEBSERVER_HOST}/resetpw/email`;
    const payload = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email }),
    };
    const result = await fetch(url, payload);
    const resultJson = await result.json();
    if (!resultJson.success) {
      if (resultJson.errorType === null) {
        console.log("Unknown error occurs!");
        return;
      }
    } else {
      navigate("/reset/email/success");
    }
  };

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
            <Form style={{ height: "50%"}}>
              <div style = {{height: "30%"}}/>
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
                onClick={handleSendResetPwEmail}
              >
                Confirm
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
