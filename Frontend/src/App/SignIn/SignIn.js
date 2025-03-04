import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import "./SignIn.css";
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
                if (response.status == "404") {
                    setError("Invalid username/password")
                }
                return false
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
            }
        }
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
            <div className="signin-container">
                <div className="careerboost-content">
                {/* Left Side: Logo & Tagline */}
                <div className="careerboost-logo">
                    <h1>careerboost</h1>
                    <p>Connect with jobs and the world around you on careerboost.</p>
                </div>
                    {/* Right Side: Sign-in Form */}
                <div className="signin-box">
                        <Card className="signin-card">
                            <Card.Body>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="formUsername" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="signin-input"
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formPassword" className="mb-3">
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="signin-input"
                                        />
                                    </Form.Group>

                                    <Button variant="primary" type="submit" className="signin-button">
                                        Sign in
                                    </Button>

                                    {error && <div className="error-message" style={{color: "red"}}>{error}</div>}
                                    <div className="forgot-password">Forgot password?</div>

                                    <hr/>

                                    <Button variant="success" onClick={handleCreateAccount} className="create-account">
                                        Create new account
                                    </Button>

                                </Form>
                            </Card.Body>
                        </Card>
                </div>
            </div>
        </div></div>
    );

};

export default SignIn;
