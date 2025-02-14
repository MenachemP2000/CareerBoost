import React from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import image1 from "../images/image3.jpg";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import config from '../config';

const Profile = ({ toggleScreen, isSignedIn, toggleSignendIn }) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        toggleScreen("Profile");
        if (!isSignedIn) {
            navigate("/");
        }
    });

    const handleSignout = () => {
        toggleSignendIn(false);
    }
    const handlePredict = async (e) => {
        e.preventDefault();

        const payload = { _id: isSignedIn._id, username: isSignedIn.username };
        try {
            const userprofile = { Country: isSignedIn.country, WorkExp: isSignedIn.experience, EdLevel: isSignedIn.education, Age: isSignedIn.age };
            // Send the registration data to the server
            console.log(userprofile);
            const response = await fetch(`${config.apiBaseUrl}/api/model/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userprofile)
            });

            const result = await response.json();
            payload.prediction = Math.floor(result.prediction);

            if (!response.ok) {
                // If the server responds with an error, set the error message
                setError(result.message);
                return;
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
        try {
            const response = await fetch(`${config.apiBaseUrl}/api/users/${isSignedIn._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                // If the server responds with an error, set the error message
                setError(result.message);
                return;
            }
            toggleSignendIn(isSignedIn.username);
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    }
    const handleReset = async (e) => {
        e.preventDefault();
        const payload = { _id: isSignedIn._id, username: isSignedIn.username };
        payload.prediction = 0;
        try {
            // Send the registration data to the server
            const response = await fetch(`${config.apiBaseUrl}/api/users/${isSignedIn._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                // If the server responds with an error, set the error message
                setError(result.message);
                return;
            }
            toggleSignendIn(isSignedIn.username);
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    }
    return (

        <div>
            <div className="position-relative text-white text-center">
                <img src={image1} className="d-block w-100" alt="..." style={{ height: "100vh", objectFit: "cover" }} />
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column align-items-center justify-content-center">
                    <h3 className="display-4 fw-bold">Profile</h3>
                    <div className="underline mx-auto mb-3"></div>

                    <p className="lead">
                        Here's an overview of your Information:
                    </p>
                    {isSignedIn &&
                        <Row className="d-flex justify-content-center">
                            <Card style={{ width: '18rem', margin: "10px" }}>
                                <Card.Header>{isSignedIn.username}</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        Country: {isSignedIn.country}
                                    </Card.Text>
                                    <Card.Text>
                                        Experience:  {isSignedIn.experience}
                                    </Card.Text>
                                    <Card.Text>
                                        Education: {isSignedIn.education}
                                    </Card.Text>
                                    <Card.Text>
                                        Age: {isSignedIn.age}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            {((!isSignedIn.prediction) || isSignedIn.prediction === 0) &&
                                <Card style={{ width: '18rem', margin: "10px" }}>
                                    <Card.Header>Salary Prediction</Card.Header>
                                    <Card.Body >
                                        <Card.Text>
                                            We Havent Predicted your Salary Yet,
                                            click the button below to 
                                            Let our AI predict your salary!
                                        </Card.Text>
                                        <Button as={Button} onClick={handlePredict} variant="primary" className="px-5 py-3">Predict</Button>
                                    </Card.Body>
                                </Card>

                            }
                            {(isSignedIn.prediction && isSignedIn.prediction !== 0) &&
                                <Card style={{ width: '18rem', margin: "10px" }}>
                                    <Card.Header>Salary Prediction</Card.Header>
                                    <Card.Body >
                                        <Card.Text>
                                            Our advanced AI model predicts your salary to be around:
                                            <br />

                                            {isSignedIn.prediction} $ per year
                                            <br />
                                            if you change your information, you can repredict your salary
                                        </Card.Text>
                                        <Button as={Button} onClick={handlePredict} variant="primary" className="px-5 py-3">Repredict</Button>
                                    </Card.Body>
                                </Card>

                            }
                            <Container className="d-flex justify-content-center" >
                                <Button as={Link} to="/ModifyAccount" style={{ width: '10rem', margin: "10px" }} variant="primary" className="px-5 py-3">Modify</Button>
                                <Button as={Link} to="/Recommendations" style={{ margin: "10px" }} variant="primary" className="px-5 py-3">Recommendations</Button>
                                <Button as={Button} style={{ width: '10rem', margin: "10px" }} onClick={handleSignout} variant="primary" className="px-5 py-3">Sign Out</Button>
                            </Container>
                        </Row>
                    }

                </div>
            </div>
        </div>
    );
}

export default Profile;