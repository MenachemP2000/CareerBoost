import React from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import image1 from "../images/image3.jpg";
import { useEffect } from "react";

const Home = ({ toggleScreen, isSignedIn,toggleSignendIn }) => {

    useEffect(() => {
        toggleScreen("home");
    });

    const handleSignout = () => {
        toggleSignendIn(false);
    }
    return (

        <div>
            <div className="position-relative text-white text-center">
                <img src={image1} className="d-block w-100" alt="..." style={{ height: "100vh", objectFit: "cover" }} />
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column align-items-center justify-content-center">
                    <h3 className="display-4 fw-bold">CareerBoost</h3>
                    <div className="underline mx-auto mb-3"></div>
                    <p className="display-6">
                        Plan Your Career, Improve Your Future!
                    </p>

                    <p className="lead">
                        Our tool predicts potential salaries and suggests career moves based on your skills.
                    </p>
                    {!isSignedIn &&
                        <div className="d-flex justify-content-center">
                            <Button as={Link} to="/Createaccount" style={{ width: '15rem', margin: "10px" }} variant="primary" className="px-5 py-3">Create Account</Button>
                            <Button as={Link} to="/Signin" variant="primary" style={{ width: '15rem', margin: "10px" }} className="px-5 py-3">Sign In</Button>
                        </div>
                    }
                    {isSignedIn &&
                    <Row className="d-flex justify-content-center">
                        <p className="lead">
                            hello {isSignedIn.username}!
                        </p>
                        <div className="d-flex justify-content-center">
                            <Button as={Link} to="/Profile" variant="primary" style={{ width: '15rem', margin: "10px" }} className="px-5 py-3">Profile</Button>
                            <Button as={Button} onClick={handleSignout}  variant="primary" style={{ width: '15rem', margin: "10px" }} className="px-5 py-3">Sign Out</Button>
                        </div>
                    </Row>
                    }

                </div>
            </div>
        </div>
    );
}

export default Home;