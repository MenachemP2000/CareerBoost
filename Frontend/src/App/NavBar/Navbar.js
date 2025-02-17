import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function NavbarComponent() {
    const [isExpanded, setIsExpanded] = useState(false);

    // Function to handle the collapse of the navbar when a link is clicked
    const handleLinkClick = () => {
        setIsExpanded(false); // Close the navbar
    };

    return (
        <Navbar bg="dark" data-bs-theme="dark" expand="lg" style={{ width: "100vw" }} expanded={isExpanded}>
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img src="careerboost.ico" width="32 px" alt="CareerBoost" /> CareerBoost
                </Navbar.Brand>
                
                {/* Navbar toggle button (hamburger menu for small screens) */}
                <Navbar.Toggle 
                    aria-controls="navbar-nav" 
                    onClick={() => setIsExpanded(prevState => !prevState)} // Toggle navbar state
                />
                
                {/* Collapsing navbar items */}
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ml-auto">
                        <Link to="/" className="nav-link" onClick={handleLinkClick}>Home</Link>
                        <Link to="/profile" className="nav-link" onClick={handleLinkClick}>Profile</Link>
                        <Link to="/Prediction" className="nav-link" onClick={handleLinkClick}>Prediction</Link>
                        <Link to="/Recommendations" className="nav-link" onClick={handleLinkClick}>Recommendations</Link>
                        <Link to="/Guide" className="nav-link" onClick={handleLinkClick}>Guide</Link>
                        <Link to="/aboutus" className="nav-link" onClick={handleLinkClick}>About Us</Link>
                        <Link to="/contact" className="nav-link" onClick={handleLinkClick}>Contact Us</Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;
