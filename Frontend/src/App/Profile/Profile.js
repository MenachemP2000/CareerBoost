import React from "react";
import {Container, Row, Col, Card, Button} from 'react-bootstrap';
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import config from '../config';
import "./Profile.css"

const Profile = ({toggleScreen, isSignedIn, toggleSignendIn}) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        toggleScreen("Profile");
        if (!isSignedIn) {
            navigate("/signin");
        }
    });

    const handleSignout = () => {
        toggleSignendIn(false);
    }
    const handlePredict = async (e) => {
        e.preventDefault();

        const payload = {_id: isSignedIn._id, username: isSignedIn.username};
        try {
            const userprofile = {
                Country: isSignedIn.country, WorkExp: isSignedIn.experience,
                EdLevel: isSignedIn.education, Age: isSignedIn.age
            }; //basic user profile
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
        const payload = {_id: isSignedIn._id, username: isSignedIn.username};
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
        <div className="profile-container">

            {/* Ensure nothing renders if user is not signed in */}
            {isSignedIn && (
                <Container className="profile-content">
                    <Card className="profile-card">
                        <Card.Body>
                            <Row className="justify-content-center text-center">
                                <Col md={12}>
                                    <h2 className="profile-name">{isSignedIn?.username}</h2>
                                    <p className="profile-description">Here's an overview of your information:</p>
                                </Col>
                                <Col md={12} className="profile-info">
                                    <p><strong>Country:</strong> {isSignedIn?.country}</p>
                                    <p><strong>Experience:</strong> {isSignedIn?.experience} years</p>
                                    <p><strong>Education:</strong> {isSignedIn?.education}</p>
                                    <p><strong>Age:</strong> {isSignedIn?.age}</p>
                                </Col>
                            </Row>

                            {/* Profile Buttons */}
                            <div className="profile-buttons">
                                <Button as={Link} to="/AdvancedProfile" className="profile-button">Advanced</Button>
                                <Button as={Link} to="/ModifyAccount" className="profile-button">Modify</Button>
                                <Button as={Button} onClick={handleSignout} className="profile-button">Sign Out</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            )}
        </div>
    );
}

export default Profile;