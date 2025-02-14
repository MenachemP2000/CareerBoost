import React from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import image1 from "../images/image3.jpg";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import config from '../config';

const Recommendations = ({ toggleScreen, isSignedIn, toggleSignendIn }) => {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        toggleScreen("Recommendations");
        if (!isSignedIn) {
            navigate("/");
        }
    });

    const handleSignout = () => {
        toggleSignendIn(false);
    }
    const handleRecommendations = async (e) => {
        e.preventDefault();
        const payload = { _id: isSignedIn._id, username: isSignedIn.username };

        try {
            const userprofile = { Country: isSignedIn.country, WorkExp: isSignedIn.experience, EdLevel: isSignedIn.education, Age: isSignedIn.age };
            // Send the registration data to the server
            console.log(userprofile);
            const response = await fetch(`${config.apiBaseUrl}/api/model/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userprofile)
            });

            const result = await response.json();
            payload.topRecommendations = result.recommendations;

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
                    <h3 className="display-4 fw-bold">Recommendations</h3>
                    <div className="underline mx-auto mb-3"></div>

                    <p className="lead">
                        Here's an overview of your Recommendations:
                    </p>
                    {(!isSignedIn.topRecommendations) &&
                        <Row className="d-flex justify-content-center">
                            <Card style={{ width: '18rem', margin: "10px" }}>
                                <Card.Header>Get Recommendations</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        Click the button below to get recommendations Based on your profile
                                    </Card.Text>
                                    <Button as={Button} onClick={handleRecommendations} variant="primary" className="px-5 py-3">Recommendations</Button>

                                </Card.Body>
                            </Card>
                            <Container className="d-flex justify-content-center" >
                                <Button as={Link} to="/Profile" style={{ margin: "10px" }} variant="primary" className="px-5 py-3">Profile</Button>
                            </Container>
                        </Row>
                    }

                    {(isSignedIn.topRecommendations) &&
                        <Card style={{ margin: "10px" }}>
                            <Card.Header>Recommendations</Card.Header>
                            <Card.Body >
                                <Card.Text>
                                    Our advanced AI model reccomands you to learn the following skills to increase your salary:

                                    {isSignedIn.topRecommendations.map((recommendation, index) => {
                                        return <li key={index}>{recommendation}</li>
                                    })}
                                    <br />
                                    if you change your information, you can ask to be re-recommended
                                </Card.Text>
                                <Button as={Button} onClick={handleRecommendations} variant="primary" className="px-5 py-3">Reccomand</Button>
                            </Card.Body>
                        </Card>


                    }

                    <Container className="d-flex justify-content-center" >
                        <Button as={Link} to="/ModifyAccount" style={{ width: '10rem', margin: "10px" }} variant="primary" className="px-5 py-3">Modify</Button>
                        <Button as={Link} to="/Profile" style={{ margin: "10px" }} variant="primary" className="px-5 py-3">Profile</Button>
                        <Button as={Button} style={{ width: '10rem', margin: "10px" }} onClick={handleSignout} variant="primary" className="px-5 py-3">Sign Out</Button>
                    </Container>

                </div>
            </div>
        </div>
    );
}

export default Recommendations;