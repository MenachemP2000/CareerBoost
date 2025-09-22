import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import config from '../config';
import "./CreateAccount.css";

const CreateAccount = ({ toggleSignendIn, toggleScreen, isSignedIn, countries, educations, ages }) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    /* -------------------------------
       Effects
    ------------------------------- */

    // On mount: set screen label + redirect if already signed in
    useEffect(() => {
        toggleScreen("CreateAccount");
        if (isSignedIn) {
            navigate("/");
        }
    });

    // Scroll to top on first render
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    /* -------------------------------
       Form State
    ------------------------------- */

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        country: '',
        experience: '',
        age: '',
        education: '',
        firstName: '',   // added for consistency
        lastName: ''     // added for consistency
    });

    // Update form data when user types/selects
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    /* -------------------------------
       Login Helper
    ------------------------------- */

    // Logs the user in immediately after signup
    const logIn = async () => {
        localStorage.setItem('token', ''); // clear any old token
        const { username, password } = formData;
        const data = { username, password };
        try {
            const response = await fetch(`${config.apiBaseUrl}/api/tokens`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Failed to fetch token');
            }
            const { token } = await response.json();
            localStorage.setItem('token', token);
            return true;
        } catch (error) {
            console.error('Error logging in:', error);
            return false;
        }
    };

    /* -------------------------------
       Form Submit
    ------------------------------- */

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = formData;

        try {
            // Call backend to create a new user
            const response = await fetch(`${config.apiBaseUrl}/api/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                // Display backend error message
                setError(result.message);
                return;
            }

            // If signup succeeded, log the user in and update state
            await logIn();
            toggleSignendIn(formData.username);
            navigate("/");
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };

    /* -------------------------------
       Render (JSX)
    ------------------------------- */

    return (
        <div className="signup-container">
            {/* App logo/title */}
            <h1 className="careerboost-title">careerboost</h1>

            {/* Main signup card wrapper */}
            <div className="signup-card">
                {/* Section title + subtitle */}
                <h2 className="signup-title">Create a new account</h2>
                <p className="signup-subtitle">It's quick and easy.</p>

                {/* Signup form */}
                <form onSubmit={handleSubmit} className="signup-form">

                    {/* First & Last name fields side by side */}
                    <div className="input-group">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Username field */}
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    {/* Password field */}
                    <input
                        type="password"
                        name="password"
                        placeholder="New password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    {/* Basic info label */}
                    <label>Basic Information</label>

                    {/* Country selection dropdown */}
                    <select name="country" value={formData.country} onChange={handleChange} required>
                        <option value="">Select your country</option>
                        {countries.map((country, index) => (
                            <option key={index} value={country}>{country}</option>
                        ))}
                    </select>

                    {/* Education selection dropdown */}
                    <select name="education" value={formData.education} onChange={handleChange} required>
                        <option value="">Select your education</option>
                        {educations.map((education, index) => (
                            <option key={index} value={education}>{education}</option>
                        ))}
                    </select>

                    {/* Experience numeric input */}
                    <input
                        type="number"
                        name="experience"
                        placeholder="Years of experience"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                    />

                    {/* Age selection dropdown */}
                    <select name="age" value={formData.age} onChange={handleChange} required>
                        <option value="">Select your age range</option>
                        {ages.map((age, index) => (
                            <option key={index} value={age}>{age}</option>
                        ))}
                    </select>

                    {/* Submit button */}
                    <button type="submit" className="signup-button">Sign Up</button>

                    {/* Error message (only rendered if error exists) */}
                    {error && <div className="error-message">{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default CreateAccount;
