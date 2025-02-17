import React from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import config from '../config';

const Guide = ({ toggleScreen, isSignedIn, toggleSignendIn }) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        toggleScreen("Guide");
    }, [toggleScreen]);

    return (
        <div>
            <div className="position-relative text-white text-center">
                <div style={{ minHeight: "100vh" }} className="top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column align-items-center justify-content-center">
                    <h3 className="display-4 fw-bold">Guide</h3>
                    <div className="underline mx-auto mb-3"></div>

                    <p className="lead">
                        Here's a guide to help you get started with our platform.
                    </p>

                    <div className="container">


                        <div className="row mb-4">
                            <div className="col-12 ">
                                <h4 className="fw-bold">Step 1: Getting Started</h4>
                                <p>
                                    To begin, create an account or sign in. This will allow you to get a salary prediction and access personalized recommendations tailored to you.
                                </p>
                            </div>
                        </div>


                        <div className="row mb-4">
                            <div className="col-12" >
                                <h4 className="fw-bold">Step 2: Advanced Information</h4>
                                <p>
                                    After signing in, click on <strong>Advanced</strong> to view and modify advanced information, doing so will yield more accurate predictions and relevant recommendations.
                                </p>
                            </div>  
                        </div>
                        

                        <div className="row mb-4">
                            <div className="col-12">
                                <h4 className="fw-bold">Step 3: Predictions</h4>
                                <p>
                                    To get a salary prediction, go to the prediction tab and click on <strong>Predict</strong>, Our tool will provide you with an estimate of your potential salary based on your skills and experience,
                                    by clicking <strong>Experiment</strong> you can experiment and see how different factors affect your salary without changing your profile information.      
                                </p>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-12">
                                <h4 className="fw-bold">Step 4: Recommendations</h4>
                                <p>
                                    To get recommendations go to the recommendations tab and click <strong>Reccomend</strong> , based on your profile and preferences, we will provide you with career suggestions, skills you should develop, and inform you their potential impact,
                                    by clicking on <strong>Saved</strong> you can save recommendations for later and access them,
                                    clicking on <strong>Advanced</strong> will provide you with more recommendations and let you filter and sort them based on your preferences.
                                    
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Guide;
