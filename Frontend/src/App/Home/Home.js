// Home.js
import React from "react";
import { Container, Row, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useEffect } from "react";
import './Home.css';
const Home = ({ toggleScreen, isSignedIn, toggleSignendIn }) => {

    useEffect(() => {
        toggleScreen("home");
    });

    const handleSignout = () => {
        toggleSignendIn(false);
    }
    return (
        <div className="home-container">
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
                Click on the <strong>Guide</strong> to learn how to get started and make the most of our platform.
            </p>

            {!isSignedIn &&
                <Row className="d-flex justify-content-center button-row"> {/* הוספת מחלקה button-row */}
                    <Container className=" justify-content-center">
                        <Button as={Link} to="/Createaccount" variant="primary">
                            Create Account
                        </Button>
                        <Button as={Link} to="/Signin" variant="primary">
                            Sign In
                        </Button>
                    </Container>
                </Row>
            }

            {isSignedIn &&
                <Row className=" justify-content-center button-row"> {/* הוספת מחלקה button-row */}
                    <p className="lead">
                        Hello {isSignedIn.username}!
                    </p>

                    <div className="d-flex justify-content-center">
                        <Button as={Link} to="/Guide" variant="primary">
                            Guide
                        </Button>
                        <Button as={Button} onClick={handleSignout} variant="primary">
                            Sign Out
                        </Button>
                    </div>
                </Row>
            }
        </div>
);
}

export default Home;