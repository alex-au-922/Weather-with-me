import React, { useState, useContext } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { AuthContext } from "../../middleware/auth";
import NavBar from "../../components/navbar";
import SwitchButton from "../../components/switch";
import { Container } from "react-bootstrap";


const verifyEmailAPI = '';

const Settings = () => {
    const { user, logout } = useContext(AuthContext);

    const [ viewMode, setViewMode ] = useState({
        mode: "dark",
        isSwitched: false,
    });

    const [ email, setEmail ] = useState({
        userEmail: "",
        valid: false
    })

    const clickSwitch = () => {
        let newState = !viewMode.isSwitched;
        let newMode = newState ? "light" : "dark";
        setViewMode({
          mode: newMode,
          isSwitched: newState,
        });
      };
    
    const onChangeEmail = (e) => {
        let emailInput = e.target.value;
        let validEmail = validateEmail();
        setEmail({ 
            userEmail: emailInput,
            valid: validEmail
        });
        // console.log(email);
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

    const onVerifyEmail = async (e) => {
        const Response = await fetch(verifyEmailAPI, {
            method: "POST",
        });
        await console.log(Response);
    }

    const onSubmitEmail = (e) => {
        e.preventDefault();
        if (email.valid && email.userEmail !== '') {
            // Fetch API here
            console.log(email);
        }
        else {
            window.alert('Invalid email');
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
                        <Form.Control type="email" placeholder="Enter your email" onChange={onChangeEmail} isValid={email.valid} isInvalid={!email.valid} required/>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please input a valid email.</Form.Control.Feedback>
                        <Button className="my-2" variant="outline-primary">Verify Email</Button>  
                        <Button className="mx-2" variant="outline-success" type="submit">Bind Email</Button>
                    </Form.Group>
                </Form>
                <hr/>
                <h2>
                    View Mode Setting
                </h2>
                <SwitchButton type="button" active={viewMode.isSwitched} clicked={clickSwitch}></SwitchButton>
            </Container>
        </NavBar> 
        </>
    );
};

export default Settings;