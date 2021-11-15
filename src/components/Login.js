import React, { useState } from 'react';
import { Card, Col, Row, Form, Button, InputGroup } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

import { faSignInAlt, faRedo, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomToast from './CustomToast';
import axios from 'axios';

export default function Login() {

    const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
    const [didLogin, updateLogin] = useState(false);
    const [didSubmitForm, updateSubmitForm] = useState(false);
    const [showToast, updateShowToast] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(true);
    const [toastMessage, setToastMessage] = useState("");

    const handleInputChange = e => {
        setLoginDetails(
            {
                ...loginDetails,
                [e.target.name]: e.target.value
            }
        );
    }

    const handleSubmit = e => {
        e.preventDefault();

        updateSubmitForm(true);
        handleLoginRequest();
    }

    const handleLoginRequest = () => {

        const headers = {
            'Content-Type': 'application/json',
        }

        axios.post("http://192.168.3.228:8060/member/login", loginDetails, {
            headers: headers
        }).then(response => {
            let isSuccessful = true;

            console.log(response.data);
            if (!response.status === 200) {
                isSuccessful = false;
            }

            handlePostRegister(isSuccessful, response);
        }).catch(error => {
            console.log(error);
            handlePostRegister(false, "Username or password is incorrect");
        });
    }

    const handlePostRegister = (wasSuccessful, response) => {
        cancelForm(); // Clears the form

        setIsSuccessful(wasSuccessful);
        setToastMessage(wasSuccessful ? response.data.message : response);
        updateShowToast(true);

        setTimeout(() => {
            if (wasSuccessful) {

                localStorage.setItem("userId", response.data.payload.id);
                localStorage.setItem("email", response.data.payload.email);
                localStorage.setItem("token", response.data.payload.token);

                updateLogin(!didLogin);
            }
            else {
                updateShowToast(false);
                updateSubmitForm(false);
            }
        }, 2000);
    }

    const cancelForm = () => {
        document.getElementById("loginFormId").reset();
    }

    if (didLogin) {
        return <Navigate to="/" />
    }

    return (
        <div>
            <div style={{ "display": showToast ? "block" : "none" }}>
                <CustomToast success={isSuccessful} message={toastMessage} />
            </div>
            <Card>
                <Card.Header style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    <div>
                        <FontAwesomeIcon icon={faSignInAlt} style={{ color: '#e2821d' }} />  Login
                    </div>
                </Card.Header>

                <Card.Title className="mb-1 p-3">Login with your email and password:</Card.Title>
                <Form onSubmit={handleSubmit} id="loginFormId">
                    <Card.Body>
                        <Row>
                            <Col lg={12}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email:</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text id="basic-addon1"><strong>@</strong></InputGroup.Text>
                                        <Form.Control type="email" placeholder="name@example.com" name="email"
                                            onChange={handleInputChange} required />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password:</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text><FontAwesomeIcon icon={faLock} /></InputGroup.Text>
                                        <Form.Control type="password" placeholder="Enter your password" name="password"
                                            onChange={handleInputChange} required />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card.Body>
                    <Card.Footer>
                        <div className="d-flex justify-content-end">
                            <Button variant="primary" onClick={cancelForm}>
                                <FontAwesomeIcon icon={faRedo} style={{ marginRight: '5px' }} /> Clear
                            </Button>

                            <Button type="submit" style={{ cursor: 'pointer' }} className="ms-3" variant="success" disabled={didSubmitForm}>
                                <div><FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: '5px' }} />
                                    {didSubmitForm ? 'Please wait...' : 'Login'}
                                </div>
                            </Button>
                        </div>
                    </Card.Footer>
                </Form>
            </Card>
        </div>
    )
}