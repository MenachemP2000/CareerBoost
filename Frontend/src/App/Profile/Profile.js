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

  {isSignedIn && (
    <Container className="profile-grid">
      <Row>
        {/* LEFT: content list (no cards) */}
        <Col md={7} lg={7} className="left-col">
          <section className="section">
             <div className="section-header">
    <h4 className="section-title">Personal Profile</h4>
    <p className="section-subtitle">
      This information will be used to personalize our communications with you.
    </p>
  </div>

            <div className="list">
              {/* Name */}
              <div className="list-item">
                <div className="list-label">Name</div>
                <div className="list-content">
                  {!editMode ? (
                    <div className={`list-value ${!formData.username ? 'empty' : ''}`}>
                      {formData.username || 'Not Provided'}
                    </div>
                  ) : (
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  )}
                </div>
                {!editMode && <span className="chevron" aria-hidden>›</span>}
              </div>

              {/* Country */}
              <div className="list-item">
                <div className="list-label">Country</div>
                <div className="list-content">
                  {!editMode ? (
                    <div className={`list-value ${!formData.country ? 'empty' : ''}`}>
                      {formData.country || 'Not Provided'}
                    </div>
                  ) : (
                    <Form.Select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option value="">Select your country</option>
                      {countries.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </Form.Select>
                  )}
                </div>
                {!editMode && <span className="chevron" aria-hidden>›</span>}
              </div>

              {/* Job experience */}
              <div className="list-item">
                <div className="list-label">Years of Experience</div>
                <div className="list-content">
                  {!editMode ? (
                    <div className={`list-value ${!formData.experience ? 'empty' : ''}`}>
                      {formData.experience || 'Not Provided'}
                    </div>
                  ) : (
                    <Form.Control
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                    />
                  )}
                </div>
                {!editMode && <span className="chevron" aria-hidden>›</span>}
              </div>

              {/* Education */}
              <div className="list-item">
                <div className="list-label">Education</div>
                <div className="list-content">
                  {!editMode ? (
                    <div className={`list-value ${!formData.education ? 'empty' : ''}`}>
                      {formData.education || 'Not Provided'}
                    </div>
                  ) : (
                    <Form.Select
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                    >
                      <option value="">Select your education</option>
                      {educations.map((e, i) => (
                        <option key={i} value={e}>{e}</option>
                      ))}
                    </Form.Select>
                  )}
                </div>
                {!editMode && <span className="chevron" aria-hidden>›</span>}
              </div>

              {/* Age */}
              <div className="list-item">
                <div className="list-label">Age</div>
                <div className="list-content">
                  {!editMode ? (
                    <div className={`list-value ${!formData.age ? 'empty' : ''}`}>
                      {formData.age || 'Not Provided'}
                    </div>
                  ) : (
                    <Form.Select
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                    >
                      <option value="">Select your age range</option>
                      {ages.map((a, i) => (
                        <option key={i} value={a}>{a}</option>
                      ))}
                    </Form.Select>
                  )}
                </div>
                {!editMode && <span className="chevron" aria-hidden>›</span>}
              </div>
            </div>
          </section>

          {/* Buttons */}
          <div className="profile-buttons left">
            {!editMode ? (
              <>
                <button className="profile-button" onClick={handleEditToggle}>Edit</button>
                <button onClick={() => navigate("/ModifyAdvanced")} className="profile-button secondary">Advanced</button>
                <button onClick={handleSignout} className="profile-button secondary">Sign Out</button>
              </>
            ) : (
              <>
                <button onClick={handleSubmit} className="profile-button">Save Changes</button>
                <button onClick={handleCancel} className="profile-button secondary">Cancel</button>
              </>
            )}
          </div>
        </Col>

        {/* RIGHT: image */}
        <Col md={5} lg={5} className="right-col">
          <img
            src="./images/profile-right.jpg"   /* change to your image path */
            alt="Profile illustration"
            className="profile-side-image"
          />
        </Col>
      </Row>
    </Container>
  )}
</div>


    );
}

export default Profile;
