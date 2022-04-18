import React, { useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, Container, Nav } from "react-bootstrap";

// create a component so that it has the function of navbar
export default function NavBar(props) {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/home">Weather With Me</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/home">User Profile</Nav.Link>
            <Nav.Link href="/home">Settings</Nav.Link>
            <Nav.Link href="/home">Weather Location</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      {props.children}
    </>
  );
}

// Usage in other pages: return <NavBar> <Component> </NavBar>
