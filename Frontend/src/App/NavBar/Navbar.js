import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import config from '../config';

function NavbarComponent({ exchangeRates, setExchangeRates, selectedCurrency, setSelectedCurrency,
    exchangeRate, setExchangeRate, currencyFlags, setCurrencyFlags }) {
    const [isExpanded, setIsExpanded] = useState(false);





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
    }, []);


    useEffect(() => {
        if (exchangeRates[selectedCurrency]) {
            setExchangeRate(exchangeRates[selectedCurrency]);
        }

    }, [exchangeRates, selectedCurrency]);


    const handleCurrencyChange = (currency) => {
        setSelectedCurrency(currency);
        setExchangeRate(exchangeRates[currency] || 1);
    };

    return (
        <div>
            <Navbar bg="dark" data-bs-theme="dark" expand="lg" style={{
                width: "100vw",
                position: "absolute",
                zIndex: "9999",
                maxWidth: "100%",
            }} expanded={isExpanded}>
                <Container
                >
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

                                {/* Mobile dropdown style */}
                                <Dropdown.Menu
                                    style={{
                                        maxHeight: "300px",
                                        overflowY: "auto",
                                        width: "150px", // Adjust the width for better readability
                                        whiteSpace: "nowrap",
                                        position: "absolute",
                                        top: "100%", // Makes the dropdown appear below the button
                                        left: "0", // Align the dropdown to the left
                                        right: "200%", // Optional: Adjust as needed for mobile view
                                        zIndex: "9999" // Ensures it stays on top of other elements
                                    }}
                                >
                                    {Object.keys(exchangeRates).map((currency) => (
                                        <Dropdown.Item key={currency} onClick={() => handleCurrencyChange(currency)}>
                                            <img src={currencyFlags[currency]} width="30" alt={currency} /> {currency}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                            <Link to="/" className="nav-link" onClick={() => setIsExpanded(false)}>Home</Link>
                            <Link to="/profile" className="nav-link" onClick={() => setIsExpanded(false)}>Profile</Link>
                            <Link to="/Prediction" className="nav-link" onClick={() => setIsExpanded(false)}>Prediction</Link>
                            <Link to="/Recommendations" className="nav-link" onClick={() => setIsExpanded(false)}>Recommendations</Link>
                            <Link to="/Guide" className="nav-link" onClick={() => setIsExpanded(false)}>Guide</Link>
                            <Link to="/aboutus" className="nav-link" onClick={() => setIsExpanded(false)}>About Us</Link>
                            <Link to="/contactus" className="nav-link" onClick={() => setIsExpanded(false)}>Contact Us</Link>
                            <span >Navbar end</span>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div
                className="bg-dark bg-opacity-50"
                style={{ height: "80px" }}
            >

            </div>

        </div>
    );
}

export default NavbarComponent;
