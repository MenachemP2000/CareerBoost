import React from "react";
import {Container, Row, Col, Card, Button,Image,Form} from 'react-bootstrap';
import {Link,useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import config from '../config';
import "./Profile.css"

const Profile = ({toggleScreen, isSignedIn, toggleSignendIn}) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: isSignedIn?.username || "",
        country: isSignedIn?.country || "",
        experience: isSignedIn?.experience || "",
        education: isSignedIn?.education || "",
        age: isSignedIn?.age || ""
    });

    useEffect(() => {
        toggleScreen("Profile");
        if (!isSignedIn) {
            navigate("/signin");
        }
        }, [isSignedIn, navigate, toggleScreen]);

    const handleSignout = () => {
        toggleSignendIn(false);
    }
    const handleEditToggle = () => {
        setEditMode(!editMode);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { _id: isSignedIn._id, ...formData };
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
                setError(result.message);
                return;
            }

            toggleSignendIn({ ...isSignedIn, ...formData });
            setEditMode(false); // Switch back to view mode after saving
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };
    //
    // const handlePredict = async (e) => {
    //     e.preventDefault();
    //
    //     const payload = {_id: isSignedIn._id, username: isSignedIn.username};
    //     try {
    //         const userprofile = {
    //             Country: isSignedIn.country, WorkExp: isSignedIn.experience,
    //             EdLevel: isSignedIn.education, Age: isSignedIn.age
    //         }; //basic user profile
    //         if (isSignedIn.MainBranch) {
    //             userprofile.MainBranch = isSignedIn.MainBranch;
    //         }
    //         if (isSignedIn.RemoteWork) {
    //             userprofile.RemoteWork = isSignedIn.RemoteWork;
    //         }
    //         if (isSignedIn.DevType) {
    //             userprofile.DevType = isSignedIn.DevType;
    //         }
    //         if (isSignedIn.OrgSize) {
    //             userprofile.OrgSize = isSignedIn.OrgSize;
    //         }
    //         if (isSignedIn.ICorPM) {
    //             userprofile.ICorPM = isSignedIn.ICorPM;
    //         }
    //         if (isSignedIn.Industry) {
    //             userprofile.Industry = isSignedIn.Industry;
    //         }
    //         if (isSignedIn.YearsCode) {
    //             userprofile.YearsCode = isSignedIn.YearsCode;
    //         }
    //         if (isSignedIn.YearsCodePro) {
    //             userprofile.YearsCodePro = isSignedIn.YearsCodePro;
    //         }
    //         if (isSignedIn.JobSat) {
    //             userprofile.JobSat = isSignedIn.JobSat;
    //         }
    //         if (isSignedIn.languages) {
    //             for (let i = 0; i < isSignedIn.languages.length; i++) {
    //                 userprofile[isSignedIn.languages[i]] = 1;
    //             }
    //         }
    //         if (isSignedIn.employments) {
    //             for (let i = 0; i < isSignedIn.employments.length; i++) {
    //                 userprofile[isSignedIn.employments[i]] = 1;
    //             }
    //         }
    //         // Send the registration data to the server
    //         console.log(userprofile);
    //         const response = await fetch(`${config.apiBaseUrl}/api/model/predict`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(userprofile)
    //         });
    //
    //         const result = await response.json();
    //         payload.prediction = Math.floor(result.prediction);
    //
    //         if (!response.ok) {
    //             // If the server responds with an error, set the error message
    //             setError(result.message);
    //             return;
    //         }
    //     } catch (error) {
    //         setError('An error occurred. Please try again.');
    //         console.error('Error:', error);
    //     }
    //     try {
    //         const response = await fetch(`${config.apiBaseUrl}/api/users/${isSignedIn._id}`, {
    //             method: 'PATCH',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${localStorage.getItem('token')}`
    //             },
    //             body: JSON.stringify(payload)
    //         });
    //
    //         const result = await response.json();
    //
    //         if (!response.ok) {
    //             // If the server responds with an error, set the error message
    //             setError(result.message);
    //             return;
    //         }
    //         toggleSignendIn(isSignedIn.username);
    //     } catch (error) {
    //         setError('An error occurred. Please try again.');
    //         console.error('Error:', error);
    //     }
    // }
    // const handleReset = async (e) => {
    //     e.preventDefault();
    //     const payload = {_id: isSignedIn._id, username: isSignedIn.username};
    //     payload.prediction = 0;
    //     try {
    //         // Send the registration data to the server
    //         const response = await fetch(`${config.apiBaseUrl}/api/users/${isSignedIn._id}`, {
    //             method: 'PATCH',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${localStorage.getItem('token')}`
    //             },
    //             body: JSON.stringify(payload)
    //         });
    //
    //         const result = await response.json();
    //
    //         if (!response.ok) {
    //             // If the server responds with an error, set the error message
    //             setError(result.message);
    //             return;
    //         }
    //         toggleSignendIn(isSignedIn.username);
    //     } catch (error) {
    //         setError('An error occurred. Please try again.');
    //         console.error('Error:', error);
    //     }
    // }
    return (
        <div className="profile-container">
            {/* Profile Card */}
            {isSignedIn && (
                <Container className="profile-content d-flex justify-content-center">
                    <Card className="profile-card">

                        <Card.Body className="profile-body">
                            <div className="profile-header">
                                {/* Profile Picture */}
                                <Image src="/path-to-profile-pic.jpg" roundedCircle className="profile-picture"/>
                            </div>
                            <h2 className="profile-name">{formData.username}</h2>
                            <p className="profile-description">Here's an overview of your information:</p>

                            {/* Toggle between View & Edit Mode */}
                            {!editMode ? (
                                // View Mode
                                <>
                                    <Col md={12} className="profile-info">
                                        <p><strong>Country:</strong> {formData.country}</p>
                                        <p><strong>Experience:</strong> {formData.experience} years</p>
                                        <p><strong>Education:</strong> {formData.education}</p>
                                        <p><strong>Age:</strong> {formData.age}</p>
                                    </Col>

                                    {/* Profile Buttons */}
                                    <div className="profile-buttons">
                                        <Button as={Link} to="/AdvancedProfile"
                                                className="profile-button">Advanced</Button>
                                        <Button onClick={handleEditToggle} className="profile-button">Edit
                                            Profile</Button>
                                        <Button onClick={handleSignout} className="profile-button">Sign Out</Button>
                                    </div>
                                </>
                            ) : (
                                // Edit Mode (Form)
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="formUsername" className="profile-form">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formCountry" className="mb-3">
                                        <Form.Label>Country</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formExperience" className="mb-3">
                                        <Form.Label>Years of Experience</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formEducation" className="mb-3">
                                        <Form.Label>Education</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="education"
                                            value={formData.education}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formAge" className="mb-3">
                                        <Form.Label>Age</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    {/* Profile Buttons */}
                                    <div className="profile-buttons">
                                        <Button type="submit" className="profile-button">Save Changes</Button>
                                        <Button onClick={handleEditToggle}
                                                className="profile-button">Cancel</Button>
                                    </div>
                                </Form>
                            )}
                        </Card.Body>
                    </Card>
                </Container>
            )}
        </div>
    );
}

export default Profile;