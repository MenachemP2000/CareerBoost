import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const SignIn = ({ toggleScreen, isSignedIn, toggleSignendIn }) => {
    const [error, setError] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();


    const logIn = async () => {
        localStorage.setItem('token', '');
        const { username, password } = formData;
        const data = { username: username, password: password }
        try {
            const response = await fetch(`${config.apiBaseUrl}/api/tokens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Failed to fetch token');
            }
            const { token } = await response.json();
            localStorage.setItem('token', token);
            return true
        } catch (error) {
            console.error('Error loggin in:', error);
            return false
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSignedIn) {
            toggleScreen("Home")
            navigate("/");
        }
        else {
            if (await logIn()) {
                setError(false);
                toggleSignendIn(formData.username);
                toggleScreen("Home");
                navigate("/");
            } else {
                setError(true);
            }
        }
        setError(true);
    }

    const handleCreateAccount = () => {
        toggleScreen("CreateAccount")
        navigate("/createaccount");
    };



    useEffect(() => {
        toggleScreen("SignIn");
    });



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <div>
            <div className="position-relative text-white text-center" style={{ height: "100vh" }}>
                <div className=" top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column align-items-center justify-content-center">
                    <h3 className="display-4 fw-bold">Create Account</h3>
                    <div className="underline mx-auto mb-3"></div>

                    <Container className="py-6">
                        <Row>
                            <Col md={{ span: 6, offset: 3 }}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Login Details</Card.Title>
                                        <Form onSubmit={handleSubmit}>

                                            <Form.Group controlId="formUsername" className="mb-3">
                                                <Form.Label>Username</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter username"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="formPassword" className="mb-3">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Enter password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                            <Col className="d-flex justify-content-between">

                                                <Button variant="primary" type="submit">
                                                    Sign in
                                                </Button>
                                                <Button variant="primary" type="button" onClick={handleCreateAccount}>
                                                    Create account
                                                </Button>


                                            </Col>


                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        {error && <div className="error-message">{error}</div>}
                    </Container>
                </div>
            </div>
        </div>
    );

};

export default SignIn;
