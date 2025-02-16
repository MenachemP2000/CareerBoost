import React from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import config from '../config';

const Prediction = ({ toggleScreen, isSignedIn, toggleSignendIn }) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        toggleScreen("Prediction");
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
            const userprofile = { Country: isSignedIn.country, WorkExp: isSignedIn.experience,
                 EdLevel: isSignedIn.education, Age: isSignedIn.age }; //basic user profile
            if (isSignedIn.MainBranch) {
                userprofile.MainBranch = isSignedIn.MainBranch;
            }
            if (isSignedIn.RemoteWork) {
                userprofile.RemoteWork = isSignedIn.RemoteWork;
            }
            if (isSignedIn.DevType) {
                userprofile.DevType = isSignedIn.DevType;
            }
            if (isSignedIn.OrgSize) {
                userprofile.OrgSize = isSignedIn.OrgSize;
            }
            if (isSignedIn.ICorPM) {
                userprofile.ICorPM = isSignedIn.ICorPM;
            }
            if (isSignedIn.Industry) {
                userprofile.Industry = isSignedIn.Industry;
            }
            if (isSignedIn.YearsCode) {
                userprofile.YearsCode = isSignedIn.YearsCode;
            }
            if (isSignedIn.YearsCodePro) {
                userprofile.YearsCodePro = isSignedIn.YearsCodePro;
            }
            if (isSignedIn.JobSat) {
                userprofile.JobSat = isSignedIn.JobSat;
            }
            if (isSignedIn.languages) {
                for (let i = 0; i < isSignedIn.languages.length; i++) {
                    userprofile[isSignedIn.languages[i]] = 1;
                }  
            }
            if (isSignedIn.employments) {
                for (let i = 0; i < isSignedIn.employments.length; i++) {
                    userprofile[isSignedIn.employments[i]] = 1;
                }
            }
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
            <div className="position-relative text-white text-center" >
                <div style={{ minHeight: "100vh" }} className=" top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column align-items-center justify-content-center">
                    <h3 className="display-4 fw-bold">Prediction</h3>
                    <div className="underline mx-auto mb-3"></div>

                    <p className="lead">
                        Here's our model's Prediction:
                    </p>
                    {isSignedIn &&
                        <Row className="d-flex justify-content-center">
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
                                <Card style={{ width: '20rem', margin: "10px" }}>
                                    <Card.Header>Salary Prediction</Card.Header>
                                    <Card.Body >
                                        <Card.Text >
                                            The model predicts your salary to be around:
                                            <br />
                                            <br />

                                            <Card.Title style={{ color: "green" }}>{isSignedIn.prediction} $ per year</Card.Title>
                                            <br />
                                            if you change your information, you can repredict your salary
                                        </Card.Text>
                                        <Button as={Button} onClick={handlePredict} variant="primary" className="px-5 py-3">Repredict</Button>
                                    </Card.Body>
                                </Card>

                            }
                            <Container className="d-flex justify-content-center" >
                                                    <Button as={Link} to="/Experiment" style={{ width: '10rem', margin: "10px" }} variant="primary" className="px-5 py-3">Experiment</Button>
                                <Button as={Button} style={{ width: '10rem', margin: "10px" }} onClick={handleSignout} variant="primary" className="px-5 py-3">SignOut</Button>
                            </Container>
                        </Row>
                    }

                </div>
            </div>
        </div>
    );
}

export default Prediction;