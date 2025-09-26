import React from "react";
import { Link } from 'react-router-dom';  // React Router link for internal navigation
import "./Footer.css";                    // Import footer styles

// Footer component
function Footer() {
    return (
        <footer className="footer"> {/* Main footer wrapper */}

            {/* Links section: split into columns */}
            <div className="footer-links">

                {/* Company links column */}
                <div>
                    <h4>Company</h4>
                    <ul>
                        {/* External link to LinkedIn profile */}
                        <li>
                            <a href="https://www.linkedin.com/in/menachem-parente-753697187/" target="_blank" rel="noopener noreferrer">
                                LinkedIn
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Resources links column */}
                <div>
                    <h4>Resources</h4>
                    <ul>
                        {/* Internal link to the Guide page */}
                        <li><Link to="/guide">Guide</Link></li>
                    </ul>
                </div>
            </div>

            {/* Footer text (copyright) */}
            <p className="footer-text">© 2025 CareerBoost. All rights reserved.</p>
        </footer>
    );
}

export default Footer; // Export component for reuse
