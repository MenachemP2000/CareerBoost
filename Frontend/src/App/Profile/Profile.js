import React from "react";
import {Image, Form} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import config from '../config';
import "./Profile.css"
import defaultProfilePic from "../images/man-profile.svg";

const Profile = ({toggleScreen, isSignedIn, toggleSignendIn, countries, educations, ages}) => {
    const navigate = useNavigate();
    // const [error, setError] = useState('');


    // NEW: track which field is being edited
    const [fieldEditing, setFieldEditing] = useState({
        country: false, experience: false, education: false, age: false,
    });

    const toggleField = (key) => setFieldEditing((s) => ({...s, [key]: !s[key]}));

    const isAnyEditing = Object.values(fieldEditing).some(Boolean);


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

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData, [name]: value
        });
    };
    const handleSubmit = async (e) => {
        e?.preventDefault?.();
        const payload = {_id: isSignedIn._id, ...formData};
        // ...rest stays the same
        // e.preventDefault();
        // const payload = {_id: isSignedIn._id, ...formData};
        try {
            const response = await fetch(`${config.apiBaseUrl}/api/users/${isSignedIn._id}`, {
                method: 'PATCH', headers: {
                    'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}`
                }, body: JSON.stringify(payload)
            });

            // const result = await response.json();
            if (!response.ok) {
                // setError(result.message);
                return;
            }

            toggleSignendIn(isSignedIn.username);
            // setEditMode(false); // Switch back to view mode after saving
            navigate("/Profile"); // Redirect to the profile page
        } catch (error) {
            // setError('An error occurred. Please try again.');
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

        setFieldEditing({country: false, experience: false, education: false, age: false});
        // setEditMode(false); // Return to View Mode
    };


    return (
        <div className="profile-container">
        <h3 className="profile-title">Basic Profile</h3>
        <p className="profile-subtitle">
            Your public profile card with your country, experience, education and age.
        </p>
        {/* SETTINGS LAYOUT (no card) */}
        {isSignedIn && (<div className="profile-layout">
            {/* left: sections */}
            <div className="profile-main">
                <section className="settings-section">
                    <div className="section-header">
                        <h3 className="section-title">Basic Information</h3>
                        <p className="section-subtitle">This information will be used to personalize our communications with you.</p>
                    </div>

                    {/* Country */}
                    <div className="field-row">
                        <div className="field-label">Country</div>
                        <div className="field-value">
                            {!fieldEditing.country ? (<span className="value-text">
                {formData.country || "Not Provided"}
              </span>) : (<Form.Control
                                as="select"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                            >
                                <option value="">Select your country</option>
                                {countries.map((c, i) => (<option key={i} value={c}>{c}</option>))}
                            </Form.Control>)}
                        </div>
                        <button
                            className={`field-edit ${fieldEditing.country ? "active" : ""}`}
                            onClick={() => toggleField("country")}
                            aria-label="Edit country"
                            type="button"
                        >
                            <span className="chev"/>
                        </button>
                    </div>

                    {/* Experience */}
                    <div className="field-row">
                        <div className="field-label">Years of Experience</div>
                        <div className="field-value">
                            {!fieldEditing.experience ? (<span className="value-text">
                {formData.experience || "Not Provided"}
              </span>) : (<Form.Control
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                min="0"
                            />)}
                        </div>
                        <button
                            className={`field-edit ${fieldEditing.experience ? "active" : ""}`}
                            onClick={() => toggleField("experience")}
                            aria-label="Edit experience"
                            type="button"
                        >
                            <span className="chev"/>
                        </button>
                    </div>

                    {/* Education */}
                    <div className="field-row">
                        <div className="field-label">Education</div>
                        <div className="field-value">
                            {!fieldEditing.education ? (<span className="value-text">
                {formData.education || "Not Provided"}
              </span>) : (<Form.Control
                                as="select"
                                name="education"
                                value={formData.education}
                                onChange={handleChange}
                            >
                                <option value="">Select your education</option>
                                {educations.map((e, i) => (<option key={i} value={e}>{e}</option>))}
                            </Form.Control>)}
                        </div>
                        <button
                            className={`field-edit ${fieldEditing.education ? "active" : ""}`}
                            onClick={() => toggleField("education")}
                            aria-label="Edit education"
                            type="button"
                        >
                            <span className="chev"/>
                        </button>
                    </div>

                    {/* Age */}
                    <div className="field-row">
                        <div className="field-label">Age</div>
                        <div className="field-value">
                            {!fieldEditing.age ? (<span className="value-text">
                {formData.age || "Not Provided"}
              </span>) : (<Form.Control
                                as="select"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                            >
                                <option value="">Select your age range</option>
                                {ages.map((a, i) => (<option key={i} value={a}>{a}</option>))}
                            </Form.Control>)}
                        </div>
                        <button
                            className={`field-edit ${fieldEditing.age ? "active" : ""}`}
                            onClick={() => toggleField("age")}
                            aria-label="Edit age"
                            type="button"
                        >
                            <span className="chev"/>
                        </button>
                    </div>

                    {isAnyEditing && (<div className="section-actions">
                        <button onClick={() => {
                            setFieldEditing({
                                country: false, experience: false, education: false, age: false
                                });
                                handleSubmit();
                            }}
                            className="profile-button is-primary">
                            Save Changes
                        </button>
                        <button
                            onClick={() => {
                                setFieldEditing({
                                    country: false, experience: false, education: false, age: false
                                });
                                handleCancel();
                            }}
                            className="profile-button is-outline"
                        >
                            Cancel
                        </button>
                    </div>)}
                </section>
            </div>

            {/* right: avatar panel */}
            <aside className="profile-aside">
                <div className="avatar-card">
                    <div className="avatar">
                        <Image
                            src={formData.profilePicture || defaultProfilePic}
                            roundedCircle
                            className="profile-picture"
                        />
                    </div>
                    <div className="avatar-name">{formData.username}</div>
                </div>
            </aside>
        </div>)}
        <div className="profile-buttons">
            <>
                <button onClick={() => navigate("/ModifyAdvanced")}
                        className="profile-button is-outline">Advanced
                </button>
            </>
            <button onClick={handleSignout} className="profile-button is-danger-outline">Sign Out</button>
            {/*</>*/}
        </div>
    </div>);
};

export default Profile;
