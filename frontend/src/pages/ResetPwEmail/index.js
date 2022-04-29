import React, { useState } from "react";
import { Form, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BACKEND_HOST } from "../../frontendConfig";

const ResetPasswordEmail = (props) => {
  const [email, setEmail] = useState();
  const navigate = useNavigate();

  const handleSendResetPwEmail = async () => {
    const url = `${BACKEND_HOST}/resetpw/email`;
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
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>Input your email</Card.Title>
        <Form>
          <Form.Control
            type="text"
            placeholder="Username"
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button variant="primary" onClick={handleSendResetPwEmail}>
            Confirm
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ResetPasswordEmail;
