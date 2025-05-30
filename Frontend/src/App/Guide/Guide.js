import React from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import config from '../config';
import "./Guide.css";

const Guide = ({ toggleScreen, isSignedIn, toggleSignendIn }) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        toggleScreen("Guide");
    }, [toggleScreen]);

    const steps = [
        {
            title: "Step 1: Getting Started",
            content: "To begin, create an account or sign in. This will allow you to get a salary prediction and access personalized recommendations tailored to you."
        },
        {
            title: "Step 2: Advanced Information",
            content: "After signing in, click on Advanced to view and modify advanced information. Doing so will yield more accurate predictions and relevant recommendations."
        },
        {
            title: "Step 3: Predictions",
            content: "To get a salary prediction, go to the prediction tab and click on Predict. Our tool will provide you with an estimate of your potential salary based on your skills and experience. By clicking Experiment, you can experiment and see how different factors affect your salary without changing your profile information."
        },
        {
            title: "Step 4: Recommendations",
            content: "To get recommendations, go to the recommendations tab and click Recommend. Based on your profile and preferences, we will provide you with career suggestions, skills you should develop, and inform you of their potential impact. Clicking on Saved allows you to save recommendations for later access, and clicking on Advanced provides more recommendations with filtering options."
        }
    ];


    return (
        <div className="guide-container">
            {/*<Container className="d-flex justify-content-center">*/}
                <h2 className="guide-title text-center">Guide</h2>
                <p className="guide-description text-center">
                    Here's a guide to help you get started with our platform.
                </p>

                {steps.map((step, index) => (
                    <Row
                        key={index}
                        className={`guide-row ${index % 2 === 0 ? "left" : "right"}`}
                    >
                        <Col md={6}>
                            <Card className="guide-card">
                                <Card.Body>
                                    <h4 className="guide-step">{step.title}</h4>
                                    <p>{step.content}</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                ))}


        </div>
    );
};

export default Guide;


{/*    <Card className="guide-card">*/}
{/*        <Card.Body>*/}
{/*            <h2 className="guide-title">Guide</h2>*/}
{/*            <p className="guide-description">*/}
{/*                Here's a guide to help you get started with our platform.*/}
{/*            </p>*/}

{/*            <div className="guide-section">*/}
{/*                <h4 className="guide-step">Step 1: Getting Started</h4>*/}
{/*                <p>*/}
{/*                    To begin, create an account or sign in. This will allow you to get a salary prediction*/}
{/*                    and access personalized recommendations tailored to you.*/}
{/*                </p>*/}
{/*            </div>*/}

{/*            <div className="guide-section">*/}
{/*                <h4 className="guide-step">Step 2: Advanced Information</h4>*/}
{/*                <p>*/}
{/*                    After signing in, click on <strong>Advanced</strong> to view and modify advanced information.*/}
{/*                    Doing so will yield more accurate predictions and relevant recommendations.*/}
{/*                </p>*/}
{/*            </div>*/}

{/*            <div className="guide-section">*/}
{/*                <h4 className="guide-step">Step 3: Predictions</h4>*/}
{/*                <p>*/}
{/*                    To get a salary prediction, go to the prediction tab and click on <strong>Predict</strong>. Our tool will provide you*/}
{/*                    with an estimate of your potential salary based on your skills and experience. By clicking*/}
{/*                    <strong> Experiment</strong>, you can experiment and see how different factors affect your salary without changing*/}
{/*                    your profile information.*/}
{/*                </p>*/}
{/*            </div>*/}

{/*            <div className="guide-section">*/}
{/*                <h4 className="guide-step">Step 4: Recommendations</h4>*/}
{/*                <p>*/}
{/*                    To get recommendations, go to the recommendations tab and click <strong>Recommend</strong>. Based on your profile*/}
{/*                    and preferences, we will provide you with career suggestions, skills you should develop, and inform you of their*/}
{/*                    potential impact. Clicking on <strong>Saved</strong> allows you to save recommendations for later access, and clicking*/}
{/*                    on <strong>Advanced</strong> provides more recommendations with filtering options.*/}
{/*                </p>*/}
{/*            </div>*/}
{/*        </Card.Body>*/}
{/*    </Card>*/}
{/*</Container>*/}