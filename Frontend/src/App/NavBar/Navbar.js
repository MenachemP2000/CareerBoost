import { Navbar, Nav, Container, Dropdown, Form } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import config from '../config';
import './Navbar.css';
function NavbarComponent({ exchangeRates, setExchangeRates, selectedCurrency, setSelectedCurrency,
                             exchangeRate, setExchangeRate, currencyFlags, setCurrencyFlags }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [darkMode, setDarkMode] = useState(false); // State for dark mode

    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/api/exchange`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch exchange rates");
                }
                const data = await response.json();

                const sortedData = Object.fromEntries(
                    Object.entries(data).sort(([a], [b]) => a.localeCompare(b))
                );

                setExchangeRates(sortedData);
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
            }
        };

        const fetchCurrencyFlags = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/api/exchange/flags`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch currency flags");
                }
                const data = await response.json();
                setCurrencyFlags(data);
            } catch (error) {
                console.error('Error fetching currency flags:', error);
            }
        };
        fetchExchangeRates();
        fetchCurrencyFlags();
    },[]);

    useEffect(() => {
        if (exchangeRates[selectedCurrency]) {
            setExchangeRate(exchangeRates[selectedCurrency]);
        }
    }, [exchangeRates, selectedCurrency]);

    const handleCurrencyChange = (currency) => {
        setSelectedCurrency(currency);
        setExchangeRate(exchangeRates[currency] || 1);
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    // Apply/remove dark mode class to body
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    return (
        <div>
            <Navbar className="Navbar-App" expand="lg" expanded={isExpanded}>
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img src="careerboost.ico" width="32px" alt="CareerBoost" /> CareerBoost
                    </Navbar.Brand>

                    <Navbar.Toggle
                        aria-controls="navbar-nav"
                        onClick={() => setIsExpanded(prevState => !prevState)}
                    />

                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="ms-auto d-flex align-items-center">
                            <Dropdown className="ms-3"
                                      style={{
                                          display: "inline-block",
                                          position: "relative"
                                      }}>
                                <Dropdown.Toggle variant="success">
                                    <img src={currencyFlags[selectedCurrency]} width="30" alt={selectedCurrency} />
                                </Dropdown.Toggle>

                                <Dropdown.Menu
                                    style={{
                                        maxHeight: "300px",
                                        overflowY: "auto",
                                        width: "150px",
                                        whiteSpace: "nowrap",
                                        position: "absolute",
                                        top: "100%",
                                        left: "0",
                                        zIndex: "9999"
                                    }}
                                >
                                    {Object.keys(exchangeRates).map((currency) => (
                                        <Dropdown.Item key={currency} onClick={() => handleCurrencyChange(currency)}>
                                            <img src={currencyFlags[currency]} width="30" alt={currency} /> {currency}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>

                            {/* Dark Mode Toggle */}
                            <div className="ms-3">
                                <Form>
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        // label={darkMode ? "Dark Mode" : "Light Mode"}
                                        checked={darkMode}
                                        onChange={toggleDarkMode}
                                    />
                                </Form>
                            </div>

                            <Link to="/" className="nav-link" onClick={() => setIsExpanded(false)}>Home</Link>
                            <Link to="/profile" className="nav-link" onClick={() => setIsExpanded(false)}>Profile</Link>
                            <Link to="/Prediction" className="nav-link" onClick={() => setIsExpanded(false)}>Prediction</Link>
                            <Link to="/Recommendations" className="nav-link" onClick={() => setIsExpanded(false)}>Recommendations</Link>
                            <Link to="/SavedJobs" className="nav-link" onClick={() => setIsExpanded(false)}>Jobs</Link>
                            <Link to="/Guide" className="nav-link" onClick={() => setIsExpanded(false)}>Guide</Link>
                            <Link to="/contactus" className="nav-link" onClick={() => setIsExpanded(false)}>Contact Us</Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default NavbarComponent;