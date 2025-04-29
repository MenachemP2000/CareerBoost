import React from "react";
import {Container, Row, Col, Card, Button, Image, Form} from 'react-bootstrap';
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import config from '../config';
import "./Profile.css"
import defaultProfilePic from "../images/man-profile.svg";

const Profile = ({toggleScreen, isSignedIn, toggleSignendIn, countries, educations, ages}) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);

    // Form state with user data
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSignedIn]);

    // Sign out function
    const handleSignout = () => {
        toggleSignendIn(false);
    }
    const handleEditToggle = () => {
        setEditMode(!editMode);
    };
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {_id: isSignedIn._id, ...formData};
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

            toggleSignendIn(isSignedIn.username);
            setEditMode(false); // Switch back to view mode after saving
            navigate("/Profile"); // Redirect to the profile page
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };

    // Cancel Editing (Resets Form)
    const handleCancel = () => {
        // Reset form data to the original state before editing
        setFormData({
            username: isSignedIn?.username || "",
            country: isSignedIn?.country || "",
            experience: isSignedIn?.experience || "",
            education: isSignedIn?.education || "",
            age: isSignedIn?.age || ""
        });

        setEditMode(false); // Return to View Mode
    };


    return (
        <div className="profile-container">
            <h3 className="profile-title">Basic Profile</h3>
            <p className="profile-subtitle">
                Your public profile card with your country, experience, education and age.
            </p>
            {/* Profile Card */}
            {isSignedIn && (
                <Container className="profile-content d-flex justify-content-center">
                    <Card className="profile-card">
                        <Card.Body className="profile-body">

                            <div className="text-center mb-4">
                                <h2 className="title">Basic Information</h2>
                            </div>
                            <br></br>
                            {/* Profile PiScture */}
                            <div className="profile-header">
                                <Image
                                    src={formData.profilePicture || defaultProfilePic}
                                    roundedCircle
                                    className="profile-picture"
                                />
                            </div>
                            <h2 className="profile-name">{formData.username}</h2>
                            <br></br>

                            {/*/!* Toggle between View & Edit Mode *!/*/}
                            {/*{!editMode ? (*/}
                            {/*        // View Mode*/}
                            {/*        <>*/}
                            {/*            <Col md={12} className="profile-info">*/}
                            {/*                <p><strong>Country:</strong> {formData.country}</p>*/}
                            {/*                <p><strong>Experience:</strong> {formData.experience} years</p>*/}
                            {/*                <p><strong>Education:</strong> {formData.education}</p>*/}
                            {/*                <p><strong>Age:</strong> {formData.age}</p>*/}
                            {/*            </Col>*/}
                            {/*            <br></br>*/}
                            {/*            /!* Profile Buttons *!/*/}
                            {/*            <div className="profile-buttons">*/}
                            {/*                <>*/}
                            {/*                    <button onClick={() =>navigate("/ModifyAdvanced")} className="profile-button">Advanced*/}
                            {/*                    </button>*/}
                            {/*                    <button onClick={handleEditToggle} className="profile-button">Edit*/}
                            {/*                    </button>*/}
                            {/*                    <button onClick={handleSignout} className="profile-button">Sign Out</button>*/}
                            {/*                </>*/}
                            {/*            </div>*/}
                            {/*        </>*/}
                            {/*    // <button as={Button} className="advanced-button" onClick={() => navigate("/Profile")}>*/}
                            {/*    // Back*/}
                            {/*    // </button>*/}
                            {/*) : (*/}

                            <Form>{/*
                                    <Form.Group controlId="formUsername" className="profile-form">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                    </Form.Group> */}

                                <Form.Group controlId="formCountry" className="mb-3">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    >
                                        <option value="">Select your country</option>
                                        {countries.map((country, index) => (
                                            <option key={index} value={country}>
                                                {country}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="formExperience" className="mb-3">
                                    <Form.Label>Years of Experience</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formEducation" className="mb-3">
                                    <Form.Label>Education</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="education"
                                        value={formData.education}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    >
                                        <option value="">Select your education</option>
                                        {educations.map((education, index) => (
                                            <option key={index} value={education}>
                                                {education}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>


                                <Form.Group controlId="formAge" className="mb-3">
                                    <Form.Label>Age</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    >
                                        <option value="">Select your age range</option>
                                        {ages.map((age, index) => (
                                            <option key={index} value={age}>
                                                {age}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                {/* Profile Buttons */}
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            )}
            <div className="profile-buttons">
                {!editMode ? (
                    <>
                        <button onClick={() => navigate("/ModifyAdvanced")}
                                className="profile-button">Advanced
                        </button>
                        <>
                            <button as={Button} className="profile-button" onClick={handleEditToggle}>Edit
                            </button>
                        </>
                        <button onClick={handleSignout} className="profile-button">Sign Out</button>
                    </>

                ) : (
                    <>
                        <button onClick={handleSubmit} className="profile-button">Save
                            Changes
                        </button>
                        <button onClick={handleCancel}
                                className="profile-button">Cancel
                        </button>
                    </>

                )}
            </div>
        </div>
    );
}

export default Profile;
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