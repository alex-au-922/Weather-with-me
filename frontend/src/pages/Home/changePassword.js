import React, { useState, useContext } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { AuthContext } from "../../middleware/auth";
import NavBar from "../../components/navbar";
import { Container } from "react-bootstrap";
import checkString from "../../utils/input/checkString";

const ChangePassword = () => {

    const { user, logout } = useContext(AuthContext);
    const [ password, setPassword ] = useState({
        password: "",
        valid: false,
    });
    const [ repassword, setRepassword ] = useState({
        repassword: "",
        match: false,
    })

    const onChangePw = (e) => {
        let password = e.target.value;
        const repw = repassword.repassword;
        let passwordCheckResult = checkString(password);
        if (!passwordCheckResult.success) {
            setPassword({
                password: password,
                valid: false
            });
        }
        else {
            setPassword({
                password: password,
                valid: true
            });
        }
        if (password === repw) {
            setRepassword({
                repassword: repw,
                match: true,
            });
        }
        else {
            setRepassword({
                repassword: repw,
                match: false,
            });
        }
    };

    const onChangeRePw = (e) => {
        let repassword = e.target.value;
        if (repassword === password.password) {
            setRepassword({
                repassword: repassword,
                match: true,
            });
        }
        else {
            setRepassword({
                repassword: repassword,
                match: false,
            });
        }
    };

    const onSubmitPw = (e) => {
        e.preventDefault();
        if (password.valid) {
            if (repassword.match) {
                console.log('OK');
            }
            else {
                console.log('Not match');
            }
        }
        else {
            console.log("INVALID PW");
        }
    };

    return (
        <>
        <NavBar user={user} logout={logout} >
            <Container style={{ justifyContent: 'center' }}>
                <h2>Password Setting</h2>
                <Form noValidate onSubmit={onSubmitPw}>
                    <Form.Group className='my-3'>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter your new password" onChange={onChangePw} isValid={password.valid} isInvalid={!password.valid} required/>
                        <Form.Control.Feedback>Valid password!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Invalid password, please enter 4 - 20 characters!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='my-3'>
                        <Form.Label>Re-enter new password</Form.Label>
                        <Form.Control type="password" placeholder="Re-enter your new password" onChange={onChangeRePw} isValid={repassword.match} isInvalid={!repassword.match} required/>
                        <Form.Control.Feedback type="invalid">Does not match with the above password</Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="outline-success" type="submit">Change Password</Button>
                </Form>                
            </Container>
        </NavBar>
        </>
    );
}


export default ChangePassword;