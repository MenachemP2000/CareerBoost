import React from "react";
import { Link } from 'react-router-dom';
import FooterComponent from "./Footer.css";
function Footer() {
    return (
        <footer className="footer">
            <div className="footer-links">
                <div>
                    <h4>Company</h4>
                    <ul>
                        {/*<li><a href="#">About Us</a></li>*/}
                        {/*<li><a href="#">Careers</a></li>*/}
                        <li><Link to="/contactus">Contact Us</Link></li>
                    </ul>
                </div>
                <div>
                    <h4>Resources</h4>
                    <ul>
                        <li><Link to="/guide">Guide</Link></li>
                        {/*<li><a href="#">Blog</a></li>*/}
                        {/*<li><a href="#">Privacy Policy</a></li>*/}
                        {/*<li><a href="#">Terms of Service</a></li>*/}
                    </ul>
                </div>
                <div>
                    <h4>Social Media</h4>
                    <ul>
                        <li><a href="#">LinkedIn</a></li>
                        {/*<li><a href="#">Twitter</a></li>*/}
                        <li><a href="#">Facebook</a></li>
                    </ul>
                </div>
            </div>
            <p className="footer-text">© 2025 CareerBoost. All rights reserved.</p>
        </footer>
    );
}

export default Footer;
