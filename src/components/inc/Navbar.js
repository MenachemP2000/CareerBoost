import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link} from 'react-router-dom';

function NavbarComponent() {
    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Link to="/" class="nav-link active"> CareerBoost</Link>
                <Nav className="me-auto">
                    <Link to="/" class="nav-link active"> Home</Link>
                    <Link to="/aboutus" class="nav-link active"> About Us</Link>
                    <Link to="/contact" class="nav-link active"> Contact Us</Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;