import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function NavbarComponent() {
    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand as={Link} to="/">CareerBoost</Navbar.Brand>
                <Nav className="ml-auto">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/aboutus" className="nav-link">About Us</Link>
                    <Link to="/contact" className="nav-link">Contact Us</Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;