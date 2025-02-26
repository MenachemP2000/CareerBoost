import React from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Home = ({ toggleScreen, isSignedIn, toggleSignendIn }) => {

    useEffect(() => {
        toggleScreen("home");
    });

    const handleSignout = () => {
        toggleSignendIn(false);
    }
    return (
        <div className="position-relative text-white text-center" >
            <div style={{ minHeight: "100vh" }} className="top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column align-items-center justify-content-center" >

                <h3 className="display-4 fw-bold">
                    <img src="careerboost.ico" alt="CareerBoost" style={{ width: "6rem" }} /> CareerBoost</h3>
                <div className="underline mx-auto mb-3"></div>
                <p className="display-6">

                    Plan Your Career, Improve Your Future!
                </p>

                <p className="lead">
                    Our tool predicts potential salaries and suggests career moves based on your skills.
                </p>
                <p className="lead">
                    Click on the <strong>Guide</strong> to learn how to get started and make the most of our platform.
                </p>
                {!isSignedIn &&
                    <Row className="d-flex justify-content-center"
                        style={{ maxWidth: "100vw" }}
                    >
                        <Container className=" justify-content-center" >
                            <Button as={Link} to="/Createaccount" style={{ width: '15rem', margin: "10px", maxWidth: '60vw', whiteSpace: "nowrap" }} variant="primary" className="px-3 py-3">Create Account</Button>
                            <Button as={Link} to="/Signin" variant="primary" style={{ width: '15rem', maxWidth: '60vw', margin: "10px", whiteSpace: "nowrap" }} className="px-3 py-3">Sign In</Button>
                        </Container>
                    </Row>
                }
                {isSignedIn &&
                    <Row className=" justify-content-center"
                        style={{ maxWidth: "100vw" }}
                    >
                        <p className="lead">
                            Hello {isSignedIn.username}!
                        </p>
                        <div className="d-flex justify-content-center">
                            <Button as={Link} to="/Guide" variant="primary" style={{ width: '10rem', margin: "10px" }} className="px-3 py-3">Guide</Button>
                            <Button as={Button} onClick={handleSignout} variant="primary" style={{ width: '10rem', margin: "10px", whiteSpace: "nowrap" }} className="px-3 py-3">Sign Out</Button>
                        </div>
                    </Row>
                }

            </div>
        </div>
    );
}

export default Home;