import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import "./SignIn.css";

/* =======================================
   SignIn Component
   - Handles login with username & password
   - Calls backend API for token
   - On success: saves token, updates state
   - On failure: shows error message
   ======================================= */
const SignIn = ({ toggleScreen, isSignedIn, toggleSignendIn }) => {
    const [error, setError] = useState(false);  // holds error message string
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const navigate = useNavigate();

    /* Scroll to top on mount */
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    /* Ensure current screen is SignIn */
    useEffect(() => {
        toggleScreen("SignIn");
    });

    /* ------------------------------
       Login function
       ------------------------------ */
    const logIn = async () => {
        // reset token before login attempt
        localStorage.setItem('token', '');
        const { username, password } = formData;
        const data = { username, password };

        try {
            const response = await fetch(`${config.apiBaseUrl}/api/tokens`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                // if backend returns 404, treat as invalid credentials
                if (response.status == "404") {
                    setError("Invalid username/password");
                }
                return false;
            }

            // extract token and save to localStorage
            const { token } = await response.json();
            localStorage.setItem('token', token);
            return true;
        } catch (error) {
            console.error('Error logging in:', error);
            return false;
        }
    };

    /* ------------------------------
       Handle form submit
       ------------------------------ */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSignedIn) {
            // already signed in, redirect home
            toggleScreen("Home");
            navigate("/");
        } else {
            if (await logIn()) {
                setError(false);
                toggleSignendIn(formData.username);  // update parent state with username
                toggleScreen("Home");
                navigate("/");
            }
        }
    };

    /* Navigate to create account page */
    const handleCreateAccount = () => {
        toggleScreen("CreateAccount");
        navigate("/createaccount");
    };

    /* Controlled input handler */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    /* ------------------------------
       JSX Render
       ------------------------------ */
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
                                    {/* Username */}
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

                                    {/* Password */}
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

                                    {/* Submit button */}
                                    <button type="submit" className="signin-button">
                                        Sign in
                                    </button>

                                    {/* Error message */}
                                    {error && (
                                        <div className="error-message" style={{ color: "red" }}>
                                            {error}
                                        </div>
                                    )}

                                    {/* Forgot password link */}
                                    <div className="forgot-password">Forgot password?</div>

                                    <hr/>

                                    {/* Create account button */}
                                    <Button
                                        variant="success"
                                        onClick={handleCreateAccount}
                                        className="create-account"
                                    >
                                        Create new account
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SignIn;
