import React, { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, Container, Nav } from "react-bootstrap";
import SwitchButton from "./switch";

const expandScreenSize = 'md';

// create a component so that it has the function of navbar
export default function NavBar(props) {

  const [state, setState] = useState({
    mode: "dark",
    isSwitched: false
  });
  
  const clickSwitch = () => {
    let newState = !state.isSwitched;
    let newMode = (newState ? "light" : "dark");
    setState({
      mode: newMode,
      isSwitched: newState
    });

  }

  return (
    <>
      <Navbar collapseOnSelect bg={state.mode} variant={state.mode} expand={expandScreenSize}>
        <Container fluid>
          <Navbar.Brand href="/home">Weather With Me</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse>            
            <Nav className="me-auto">
              <Nav.Link href="/home">User Profile</Nav.Link>
              <Nav.Link href="/home">Settings</Nav.Link>
              <Nav.Link href="/home">Weather Location</Nav.Link>
            </Nav>
            <Nav>
              <SwitchButton type="button" active={state.isSwitched} clicked={clickSwitch}>Mode</SwitchButton>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {props.children}
    </>
  );
}

// Usage in other pages: return <NavBar> <Component> </NavBar>
