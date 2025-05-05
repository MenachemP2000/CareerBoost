import React, {useState, useEffect} from "react";
import {Container, Row, Col, Card, Button, Form} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import config from '../config';
import "./CreateAccount.css";

const CreateAccount = ({toggleSignendIn, toggleScreen, isSignedIn, countries, educations, ages}) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        toggleScreen("CreateAccount");
        if (isSignedIn) {
            navigate("/");
        }
    });

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        country: '',
        experience: '',
        age: '',
        education: ''
        //gender: '',
        // birthMonth: '',
        // birthDay: '',
        // birthYear: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const logIn = async () => {
        localStorage.setItem('token', '');
        const { username, password} = formData;
        const data = { username: username, password: password }
        try {
            const response = await fetch(`${config.apiBaseUrl}/api/tokens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Failed to fetch token');
            }
            const { token } = await response.json();
            localStorage.setItem('token', token);
            return true
        } catch (error) {
            console.error('Error loggin in:', error);
            return false
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Construct the payload
        const payload = formData;
        const {username, password, country, experience, age, education} = formData;
        try {
            // Send the registration data to the server
            const response = await fetch(`${config.apiBaseUrl}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                // If the server responds with an error, set the error message
                setError(result.message);
                return;
            }

            // If registration is successful, proceed with login or other actions
            await logIn();
            toggleSignendIn(username);
            navigate("/");
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="signup-container">
            <h1 className="careerboost-title">careerboost</h1>

            <div className="signup-card">
                <h2 className="signup-title">Create a new account</h2>
                <p className="signup-subtitle">It's quick and easy.</p>

                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="input-group">
                        <input type="text" name="firstName" placeholder="First name" value={formData.firstName}
                               onChange={handleChange} required/>
                        <input type="text" name="lastName" placeholder="Last name" value={formData.lastName}
                               onChange={handleChange} required/>
                    </div>

                    <input type="text" name="username" placeholder="Username" value={formData.username}
                           onChange={handleChange} required/>
                    <input type="password" name="password" placeholder="New password" value={formData.password}
                           onChange={handleChange} required/>


                    <label>Basic Information</label>

                    <select name="country" value={formData.country} onChange={handleChange} required>
                        <option value="">Select your country</option>
                        {countries.map((country, index) => (
                            <option key={index} value={country}>{country}</option>
                        ))}
                    </select>

                    <select name="education" value={formData.education} onChange={handleChange} required>
                        <option value="">Select your education</option>
                        {educations.map((education, index) => (
                            <option key={index} value={education}>{education}</option>
                        ))}
                    </select>

                    <input type="number" name="experience" placeholder="Years of experience" value={formData.experience} onChange={handleChange} required />

                    <select name="age" value={formData.age} onChange={handleChange} required>
                        <option value="">Select your age range</option>
                        {ages.map((age, index) => (
                            <option key={index} value={age}>{age}</option>
                        ))}
                    </select>

                    <button type="submit" className="signup-button">Sign Up</button>

                    {error && <div className="error-message">{error}</div>}

                </form>
            </div>
        </div>
    )
        ;
}

export default CreateAccount;
