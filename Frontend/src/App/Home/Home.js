// Home.js
import React from "react";
import {Container, Row, Button} from 'react-bootstrap';
import {Link, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import './Home.css';
import homeBg from '../images/home-pic-light.png';


import Slider from "./Slider";

const Home = ({toggleScreen, isSignedIn, toggleSignendIn}) => {

    useEffect(() => {
        toggleScreen("home");
    });
    const navigate = useNavigate();
    const handleSignout = () => {
        toggleSignendIn(false);
    }
    return (

        <section className="picture-container">
            <div className="home-container">
                <card className="home-card">
                    <div className="home-title-container">
                        <h3 className="home-title">
                            <img src="careerboost.ico" alt="CareerBoost" style={{width: "6rem"}}/> CareerBoost
                        </h3>
                        <div className="home-underline"></div>
                    </div>
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

                    {!isSignedIn &&
                        <Row className="button-row"> {/* button-row */}
                            <div className="button-container">
                                <button type="button"
                                        className="profile-button is-outline"
                                        onClick={() => navigate("/Createaccount")}>
                                    Create Account
                                </button>
                                <button type="button"
                                        className="profile-button"
                                        onClick={() => navigate("/Signin")}>
                                    Sign In
                                </button>
                            </div>
                        </Row>
                    }

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