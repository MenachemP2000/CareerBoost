// React & Libraries
import { Navbar, Nav, Container, Dropdown, Form } from "react-bootstrap"; // Bootstrap components for layout
import { Link } from 'react-router-dom'; // Router navigation links
import { useState, useEffect } from 'react'; // React hooks
import config from '../config'; // API base URL
import './Navbar.css'; // Custom styles

/**
 * NavbarComponent
 * ----------------
 * Renders the top navigation bar for the CareerBoost app.
 * Includes:
 *   - Logo/branding
 *   - Currency selector (flags + exchange rates)
 *   - Dark mode toggle
 *   - Navigation links
 */
function NavbarComponent({
                             exchangeRates, setExchangeRates,         // rates data & setter
                             selectedCurrency, setSelectedCurrency,   // active currency & setter
                             exchangeRate, setExchangeRate,           // current exchange rate & setter
                             currencyFlags, setCurrencyFlags          // currency flag images
                         }) {
    const [isExpanded, setIsExpanded] = useState(false); // Mobile menu expanded/collapsed state
    const [darkMode, setDarkMode] = useState(false);     // Dark mode on/off

    // --- Fetch exchange rates & flags on component mount ---
    useEffect(() => {
        // Fetch exchange rates
        const fetchExchangeRates = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/api/exchange`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!response.ok) throw new Error("Failed to fetch exchange rates");

                const data = await response.json();

                // Sort by currency code alphabetically
                const sortedData = Object.fromEntries(
                    Object.entries(data).sort(([a], [b]) => a.localeCompare(b))
                );

                setExchangeRates(sortedData);
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
            }
        };

        // Fetch currency flag images
        const fetchCurrencyFlags = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/api/exchange/flags`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!response.ok) throw new Error("Failed to fetch currency flags");

                const data = await response.json();
                setCurrencyFlags(data);
            } catch (error) {
                console.error('Error fetching currency flags:', error);
            }
        };

        // Run both fetches on load
        fetchExchangeRates();
        fetchCurrencyFlags();
    }, []);

    // --- Update exchange rate whenever selection or rates change ---
    useEffect(() => {
        if (exchangeRates[selectedCurrency]) {
            setExchangeRate(exchangeRates[selectedCurrency]);
        }
    }, [exchangeRates, selectedCurrency]);

    // --- Handle currency selection ---
    const handleCurrencyChange = (currency) => {
        setSelectedCurrency(currency);
        setExchangeRate(exchangeRates[currency] || 1); // Fallback = 1
    };

    // --- Toggle dark mode state ---
    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    // --- Apply/remove dark mode class on <body> ---
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    return (
        <div>
            <Navbar className="Navbar-App" fixed="top" expand="lg" expanded={isExpanded}>
                <Container>
                    {/* Branding (logo + title) */}
                    <Navbar.Brand as={Link} to="/">
                        <img src="careerboost.ico" width="32px" alt="CareerBoost" /> CareerBoost
                    </Navbar.Brand>

                    {/* Hamburger toggle for mobile */}
                    <Navbar.Toggle
                        aria-controls="navbar-nav"
                        onClick={() => setIsExpanded(prevState => !prevState)}
                    />

                    {/* Collapsible menu items */}
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="ms-auto d-flex align-items-center">

                            {/* Currency dropdown */}
                            <Dropdown className="ms-3" style={{ display: "inline-block", position: "relative" }}>
                                <Dropdown.Toggle variant="success">
                                    <img src={currencyFlags[selectedCurrency]} width="30" alt={selectedCurrency} />
                                </Dropdown.Toggle>

                                <Dropdown.Menu
                                    style={{
                                        maxHeight: "300px", overflowY: "auto",
                                        width: "150px", whiteSpace: "nowrap",
                                        position: "absolute", top: "100%", left: "0",
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

                            {/* Dark Mode Toggle Switch */}
                            <div id="mode-toggle" className="ms-3">
                                <Form>
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        label={darkMode ? "🌙" : "🌞"} // Show moon/sun icons
                                        checked={darkMode}
                                        onChange={toggleDarkMode}
                                    />
                                </Form>
                            </div>

                            {/* Navigation links */}
                            <Link to="/" className="nav-link" onClick={() => setIsExpanded(false)}>Home</Link>
                            <Link to="/profile" className="nav-link" onClick={() => setIsExpanded(false)}>Profile</Link>
                            <Link to="/Prediction" className="nav-link" onClick={() => setIsExpanded(false)}>Prediction</Link>
                            <Link to="/Recommendations" className="nav-link" onClick={() => setIsExpanded(false)}>Recommendations</Link>
                            <Link to="/SavedJobs" className="nav-link" onClick={() => setIsExpanded(false)}>Jobs</Link>
                            <Link to="/Guide" className="nav-link" onClick={() => setIsExpanded(false)}>Guide</Link>
                            {/* <Link to="/contactus" className="nav-link">Contact Us</Link> */}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default NavbarComponent;
