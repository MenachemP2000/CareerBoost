// Home.js
import React, { useEffect } from "react";
import { Container, Row, Button } from 'react-bootstrap'; // Bootstrap layout/components
import { Link, useNavigate } from "react-router-dom";    // Routing
import './Home.css';                                     // Page-specific styles

/**
 * Home Component
 * Landing page with hero section, intro text, and sign-in / sign-out options.
 * Props:
 *  - toggleScreen: function to set the active screen name
 *  - isSignedIn: holds user object if signed in, otherwise false
 *  - toggleSignendIn: function to change sign-in state
 */
const Home = ({ toggleScreen, isSignedIn, toggleSignendIn }) => {

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Update screen name in parent whenever this component renders
    useEffect(() => {
        toggleScreen("home");
    });

    // Navigation helper
    const navigate = useNavigate();

    // Sign out handler: set isSignedIn back to false
    const handleSignout = () => {
        toggleSignendIn(false);
    }

    return (
        <section className="picture-container"> {/* Background image area */}
            <div className="home-container">    {/* Flex container */}

                {/* Card-like hero box (uses .home-card styling) */}
                <card className="home-card">

                    {/* Title block with logo + underline */}
                    <div className="home-title-container">
                        <h3 className="home-title">
                            <img src="careerboost.ico" alt="CareerBoost" style={{ width: "6rem" }} /> CareerBoost
                        </h3>
                        <div className="home-underline"></div>
                    </div>

                    {/* Hero tagline */}
                    <p className="home-lead1">
                        Plan Your Career, Improve Your Future!
                    </p>
                    <p className="home-lead">
                        Our tool predicts potential salaries and suggests career moves based on your skills.
                    </p>
                    <p className="home-lead">
                        Click on the <strong>Guide</strong> to learn how to get started and make the most of our
                        platform.
                    </p>

                    {/* IF not signed in → show Create Account + Sign In buttons */}
                    {!isSignedIn &&
                        <Row className="button-row">
                            <div className="button-container">
                                <button
                                    type="button"
                                    className="profile-button is-outline"
                                    onClick={() => navigate("/Createaccount")}
                                >
                                    Create Account
                                </button>
                                <button
                                    type="button"
                                    className="profile-button"
                                    onClick={() => navigate("/Signin")}
                                >
                                    Sign In
                                </button>
                            </div>
                        </Row>
                    }

                    {/* IF signed in → show greeting + Guide + Sign Out */}
                    {isSignedIn &&
                        <Row className="button-row">
                            <p className="hello">
                                Hello {isSignedIn.username}!
                            </p>

                            <div className="button-container">
                                <button
                                    type="button"
                                    className="profile-button is-outline"
                                    onClick={() => navigate("/Guide")}
                                >
                                    Guide
                                </button>

                                <button
                                    type="button"
                                    className="profile-button is-danger-outline"
                                    onClick={handleSignout}
                                >
                                    Sign Out
                                </button>
                            </div>
                        </Row>
                    }
                </card>
            </div>
        </section>
    );
}

export default Home;
