import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const CreateAccount = ({ toggleSignendIn, toggleScreen, isSignedIn,countries,educations,ages  }) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        toggleScreen("CreateAccount");
        if (isSignedIn) {
            navigate("/");
        }
    });

    const logIn = async () => {
        localStorage.setItem('token', '');
        const { username, password} = formData;
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

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        country: '',
        experience: '',
        age: '',
        education: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Construct the payload
        const payload = formData;
        const { username, password, country, experience, age, education } = formData;
        try {
            // Send the registration data to the server
            const response = await fetch(`${config.apiBaseUrl}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                // If the server responds with an error, set the error message
                setError(result.message);
                return;
            }

            // If registration is successful, proceed with login or other actions
            await logIn();
            toggleSignendIn(username);
            navigate("/");
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <div  className="position-relative text-white text-center" >
                <div  style={{ minHeight: "100vh" }} className=" top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column align-items-center justify-content-center">
                    <h3 className="display-4 fw-bold">Create Account</h3>
                    <div className="underline mx-auto mb-3"></div>

                    <Container className="py-6">
                        <Row>
                            <Col md={{ span: 6, offset: 3 }}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Login Information</Card.Title>
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
                                            <Card.Title>Basic Information</Card.Title>

                                            <Form.Group controlId="formCountry" className="mb-3">
                                                <Form.Label>Country</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select your country</option>
                                                    {countries.map((country, index) => (
                                                        <option key={index} value={country}>
                                                            {country}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>


                                            <Form.Group controlId="formEducation" className="mb-3">
                                                <Form.Label>Education</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="education"
                                                    value={formData.education}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select your education</option>
                                                    {educations.map((education, index) => (
                                                        <option key={index} value={education}>
                                                            {education}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>

                                            <Form.Group controlId="formExperience" className="mb-3">
                                                <Form.Label>Years of Experience</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Enter your years of experience"
                                                    name="experience"
                                                    value={formData.experience}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="formAge" className="mb-3">
                                                <Form.Label>Age</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="age"
                                                    value={formData.age}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select your age range</option>
                                                    {ages.map((age, index) => (
                                                        <option key={index} value={age}>
                                                            {age}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>

                                            <Button variant="primary" style={{ width: '10rem', margin: "10px" }} type="submit">
                                                Create Account
                                            </Button>
                                            <Button variant="primary" style={{ width: '10rem', margin: "10px" }} type="button" onClick={() => navigate("/SignIn")}>
                                                Sign In  
                                            </Button>
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
}

export default CreateAccount;
