import React from "react";
import { Image, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import config from '../config';
import "./Profile.css";
import defaultProfilePic from "../images/man-profile.svg";

/**
 * Profile Component
 * -----------------
 * Displays and allows editing of the user's basic profile:
 *   - Country, Experience, Education, Age
 *   - Username shown with avatar
 *   - Edit inline with save/cancel controls
 *   - Buttons for advanced editing and sign out
 */
const Profile = ({ toggleScreen, isSignedIn, toggleSignendIn, countries, educations, ages }) => {
    const navigate = useNavigate();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Track which field is currently being edited
    const [fieldEditing, setFieldEditing] = useState({
        country: false,
        experience: false,
        education: false,
        age: false,
    });

    // Toggle editing state for a single field
    const toggleField = (key) =>
        setFieldEditing((s) => ({ ...s, [key]: !s[key] }));

    // Check if any field is in editing mode
    const isAnyEditing = Object.values(fieldEditing).some(Boolean);

    // Local form state initialized with user data
    const [formData, setFormData] = useState({
        username: isSignedIn?.username || "",
        country: isSignedIn?.country || "",
        experience: isSignedIn?.experience || "",
        education: isSignedIn?.education || "",
        age: isSignedIn?.age || ""
    });

    // On mount or when sign-in state changes → set screen, redirect if not signed in
    useEffect(() => {
        toggleScreen("Profile");
        if (!isSignedIn) {
            navigate("/signin");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSignedIn]);

    // --- Sign out ---
    const handleSignout = () => {
        toggleSignendIn(false);
    };

    // --- Handle form value changes ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // --- Save changes to server ---
    const handleSubmit = async (e) => {
        e?.preventDefault?.();
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

            if (!response.ok) {
                // Could add error handling here
                return;
            }

            // Refresh sign-in state with updated username
            toggleSignendIn(isSignedIn.username);

            // Redirect back to Profile
            navigate("/Profile");
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // --- Cancel editing and reset form ---
    const handleCancel = () => {
        setFormData({
            username: isSignedIn?.username || "",
            country: isSignedIn?.country || "",
            experience: isSignedIn?.experience || "",
            education: isSignedIn?.education || "",
            age: isSignedIn?.age || ""
        });

        // Reset all fields to non-edit mode
        setFieldEditing({
            country: false,
            experience: false,
            education: false,
            age: false
        });
    };

    return (
        <div className="profile-container">
            {/* Header */}
            <h3 className="profile-title">Basic Profile</h3>
            <p className="profile-subtitle">
                Your public profile card with your country, experience, education and age.
            </p>

            {/* Main layout (info on left, avatar on right) */}
            {isSignedIn && (
                <div className="profile-layout">
                    {/* Left side: editable sections */}
                    <div className="profile-main">
                        <section className="settings-section">
                            <div className="section-header">
                                <h3 className="section-title">Basic Information</h3>
                                <p className="section-subtitle">
                                    This information will be used to personalize our communications with you.
                                </p>
                            </div>

                            {/* Country field */}
                            <div className="field-row">
                                <div className="field-label">Country</div>
                                <div className="field-value">
                                    {!fieldEditing.country ? (
                                        <span className="value-text">
                                            {formData.country || "Not Provided"}
                                        </span>
                                    ) : (
                                        <Form.Control
                                            as="select"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select your country</option>
                                            {countries.map((c, i) => (
                                                <option key={i} value={c}>{c}</option>
                                            ))}
                                        </Form.Control>
                                    )}
                                </div>
                                <button
                                    className={`field-edit ${fieldEditing.country ? "active" : ""}`}
                                    onClick={() => toggleField("country")}
                                    aria-label="Edit country"
                                    type="button"
                                >
                                    <span className="chev" />
                                </button>
                            </div>

                            {/* Experience field */}
                            <div className="field-row">
                                <div className="field-label">Years of Experience</div>
                                <div className="field-value">
                                    {!fieldEditing.experience ? (
                                        <span className="value-text">
                                            {formData.experience || "Not Provided"}
                                        </span>
                                    ) : (
                                        <Form.Control
                                            type="number"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            min="0"
                                        />
                                    )}
                                </div>
                                <button
                                    className={`field-edit ${fieldEditing.experience ? "active" : ""}`}
                                    onClick={() => toggleField("experience")}
                                    aria-label="Edit experience"
                                    type="button"
                                >
                                    <span className="chev" />
                                </button>
                            </div>

                            {/* Education field */}
                            <div className="field-row">
                                <div className="field-label">Education</div>
                                <div className="field-value">
                                    {!fieldEditing.education ? (
                                        <span className="value-text">
                                            {formData.education || "Not Provided"}
                                        </span>
                                    ) : (
                                        <Form.Control
                                            as="select"
                                            name="education"
                                            value={formData.education}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select your education</option>
                                            {educations.map((e, i) => (
                                                <option key={i} value={e}>{e}</option>
                                            ))}
                                        </Form.Control>
                                    )}
                                </div>
                                <button
                                    className={`field-edit ${fieldEditing.education ? "active" : ""}`}
                                    onClick={() => toggleField("education")}
                                    aria-label="Edit education"
                                    type="button"
                                >
                                    <span className="chev" />
                                </button>
                            </div>

                            {/* Age field */}
                            <div className="field-row">
                                <div className="field-label">Age</div>
                                <div className="field-value">
                                    {!fieldEditing.age ? (
                                        <span className="value-text">
                                            {formData.age || "Not Provided"}
                                        </span>
                                    ) : (
                                        <Form.Control
                                            as="select"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select your age range</option>
                                            {ages.map((a, i) => (
                                                <option key={i} value={a}>{a}</option>
                                            ))}
                                        </Form.Control>
                                    )}
                                </div>
                                <button
                                    className={`field-edit ${fieldEditing.age ? "active" : ""}`}
                                    onClick={() => toggleField("age")}
                                    aria-label="Edit age"
                                    type="button"
                                >
                                    <span className="chev" />
                                </button>
                            </div>

                            {/* Save/Cancel buttons shown only if editing */}
                            {isAnyEditing && (
                                <div className="section-actions">
                                    <button
                                        onClick={() => {
                                            setFieldEditing({
                                                country: false, experience: false,
                                                education: false, age: false
                                            });
                                            handleSubmit();
                                        }}
                                        className="profile-button is-primary"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFieldEditing({
                                                country: false, experience: false,
                                                education: false, age: false
                                            });
                                            handleCancel();
                                        }}
                                        className="profile-button is-outline"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right side: avatar */}
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
                </div>
            )}

            {/* Bottom buttons */}
            <div className="profile-buttons">
                <>
                    <button
                        onClick={() => navigate("/ModifyAdvanced")}
                        className="profile-button is-outline"
                    >
                        Advanced
                    </button>
                </>
                <button
                    onClick={handleSignout}
                    className="profile-button is-danger-outline"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Profile;
