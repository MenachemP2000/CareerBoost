import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavbarComponent() {
    return (
        <Navbar bg="dark" data-bs-theme="dark" expand="lg" style={{ width: "100vw" }}>
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img src="careerboost.ico" width="32 px" alt="CareerBoost" /> CareerBoost
                </Navbar.Brand>
                
                {/* Navbar toggle button (hamburger menu for small screens) */}
                <Navbar.Toggle aria-controls="navbar-nav" />
                
                {/* Collapsing navbar items */}
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ml-auto">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/profile" className="nav-link">Profile</Link>
                        <Link to="/Prediction" className="nav-link">Prediction</Link>
                        <Link to="/Recommendations" className="nav-link">Recommendations</Link>
                        <Link to="/Guide" className="nav-link">Guide</Link>
                        <Link to="/aboutus" className="nav-link">About Us</Link>
                        <Link to="/contact" className="nav-link">Contact Us</Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;
