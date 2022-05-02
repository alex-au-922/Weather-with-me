import React, { useState, useContext } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { AuthContext } from "../../middleware/auth";
import NavBar from "../../components/navbar";
import SwitchButton from "../../components/switch";
import { Container } from "react-bootstrap";
import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";


const Settings = () => {
    const { user, logout } = useContext(AuthContext);

    const [ viewMode, setViewMode ] = useState({
        mode: "dark",
        isSwitched: false,
    });

    const [ email, setEmail ] = useState({
        userEmail: user.email,
        valid: false
    })

    const clickSwitch = () => {
        let newState = !viewMode.isSwitched;
        let newMode = newState ? "light" : "dark";
        setViewMode({
          mode: newMode,
          isSwitched: newState,
        });
    }
    
    const onChangeEmail = (e) => {
        let emailInput = e.target.value;
        let validEmail = validateEmail();
        setEmail({ 
            userEmail: emailInput,
            valid: validEmail
        });
    }

    const validateEmail = () => {
        let validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        let valid = email.userEmail.match(validEmail);
        if (valid){
            return true
        }
        else {
            return false
        }
    }

    const onSubmitEmail = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const api = `${BACKEND_WEBSERVER_HOST}/setting/update`;        
        const payload = {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                token: token,
                username: user.username,
                email: email.userEmail,
            }),
        }
        if (email.valid && email.userEmail !== '') {
            const Response = await fetch(api, payload);
            const ResponseJson = await Response.json();
            if (ResponseJson.success) {
                window.alert('Successfully updated email.');
            }
            else {
                window.alert('Failed to update email.');
            }               
        }
        else {
            window.alert('Invalid email');
        }
    }

    const onSaveMode = async (e) => {
        const token = localStorage.getItem("token");
        const api = `${BACKEND_WEBSERVER_HOST}/setting/update`;
        const payload = {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                token: token,
                username: user.username,
                viewMode: viewMode.mode,
            }),
        }
        const Response = await fetch(api, payload);
        const ResponseJson = await Response.json();
        if (ResponseJson.success) {
            window.alert('Successfully switched mode');
        }
        else {
            window.alert('Failed to switch mode');
        }
    }

    return (
        <>
        <NavBar user={user} logout={logout}>
            <Container style={{ justifyContent: 'center' }}>
                <h2>
                    Email Setting
                </h2>
                <Form noValidate onSubmit={onSubmitEmail}>
                    <Form.Group>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" placeholder="Enter your email" value={email.userEmail} onChange={onChangeEmail} isValid={email.valid} required/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please input a valid email.</Form.Control.Feedback>
                        <Button className="my-2" variant="outline-success" type="submit">Bind Email</Button>
                    </Form.Group>
                </Form>
                <hr/>
                <h2>
                    View Mode Setting
                </h2>
                <SwitchButton type="button" active={viewMode.isSwitched} clicked={clickSwitch}></SwitchButton>
                <Button className="my-2" variant="outline-success" onClick={onSaveMode}>Save Mode</Button>
            </Container>
        </NavBar> 
        </>
    );
};

export default Settings;