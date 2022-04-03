import "./App.css";
import React, { useState, useEffect } from "react";
import { Button, InputGroup, FormControl, Card } from "react-bootstrap";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <LoginPage />
      </header>
    </div>
  );
};

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = () => {
    console.log(username);
    console.log(password);
  };
  return (
    <Card>
      <Card.Body>
        <Card.Title>Login</Card.Title>
        <InputGroup>
          <FormControl
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <FormControl
            type="text"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </InputGroup>
        <Button variant="primary" onClick={handleLogin}>
          Login
        </Button>
      </Card.Body>
    </Card>
  );
};

export default App;
