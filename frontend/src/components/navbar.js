import React, { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { DoorOpen } from "react-bootstrap-icons";
import { AuthContext } from "../middleware/auth";
import { useNavigate } from "react-router-dom";
const expandScreenSize = "md";

// create a component so that it has the function of navbar
export default function NavBar(props) {
  const { user, logout } = useContext(AuthContext);
  const [state, setState] = useState({
    mode: "dark",
    isSwitched: false,
  });

  const navigate = useNavigate();
  return (
    <>
      <Navbar
        collapseOnSelect
        bg={state.mode}
        variant={state.mode}
        expand={expandScreenSize}
      >
        <Container fluid>
          <Navbar.Brand onClick={() => navigate("/home")}>
            Weathering With Me
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate("/changepw")}>
                Change Password
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/settings")}>
                Settings
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link>
                {props.renderButton && props.renderButton(props.buttonOnClick)}
              </Nav.Link>
              <Nav.Link
                style={{ color: "#fff" }}
                disabled
              >{`${user.username}`}</Nav.Link>
              <Nav.Link onClick={logout}>
                {" "}
                <DoorOpen style={{ color: "#fff" }} />
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {props.children}
    </>
  );
}

// Usage in other pages: return <NavBar> <Component> </NavBar>
