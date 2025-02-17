import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function NavbarComponent() {
    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand  as={Link} to="/"><img src="careerboost.ico" width="32 px" /> CareerBoost </Navbar.Brand>
                <Nav className="ml-auto">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/profile" className="nav-link">Profile</Link>
                    <Link to="/Prediction" className="nav-link">Prediction</Link>
                    <Link to="/Recommendations" className="nav-link">Recommendations</Link>
                    <Link to="/Guide" className="nav-link">Guide</Link>
                    <Link to="/aboutus" className="nav-link">About Us</Link>
                    <Link to="/contact" className="nav-link">Contact Us</Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;