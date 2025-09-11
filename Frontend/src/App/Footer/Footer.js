import React from "react";
import { Link } from 'react-router-dom';
import "./Footer.css";
function Footer() {
    return (
        <footer className="footer">
            <div className="footer-links">
                <div>
                    <h4>Company</h4>
                    <ul>
                        <li><a href="https://www.linkedin.com/in/menachem-parente-753697187/">LinkedIn</a></li>

                    </ul>
                </div>
                <div>
                    <h4>Resources</h4>
                    <ul>
                        <li><Link to="/guide">Guide</Link></li>
                    </ul>
                </div>
            </div>
            <p className="footer-text">© 2025 CareerBoost. All rights reserved.</p>
        </footer>
    );
}

export default Footer;
