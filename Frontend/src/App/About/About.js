import React from "react";
import "./About.css";
import headerImage from "../images/image3.jpg"; // Import image
function AboutUs() {
    return (
        <div className="about-container">
            {/* Header Section with Background Image */}
            <div className="about-header">
                <div className="about-header" style={{ backgroundImage: `url(${headerImage})` }}>
                <h1 className="about-title">About Us</h1>
            </div>
            </div>
            {/* Main Content Section */}
            <div className="about-content">
                <p className="about-description">
                    Welcome to our platform! We provide an intelligent tool that helps users predict their salary and receive personalized career recommendations.
                </p>

                <section className="about-section">
                    <h2 className="about-subtitle">Who We Are</h2>
                    <p className="about-text">
                        We are a team dedicated to empowering individuals with data-driven insights to help them make informed career decisions. Our mission is to bridge the gap between skills and opportunities through innovative technology.
                    </p>
                </section>

                <section className="about-section">
                    <h2 className="about-subtitle">Our Vision</h2>
                    <div className="about-video-container">
                        <iframe
                            className="about-video"
                            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                            title="Our Vision Video"
                            frameBorder="0"
                            allowFullScreen>
                        </iframe>
                    </div>
                </section>

                <section className="about-section">
                    <h2 className="about-subtitle">How It Works</h2>
                    <ul className="about-steps">
                        <li>
                            <h3>Step 1: Getting Started</h3>
                            <p>Create an account or sign in to access salary predictions and personalized career recommendations.</p>
                        </li>
                        <li>
                            <h3>Step 2: Advanced Information</h3>
                            <p>Modify your profile’s advanced details to improve the accuracy of predictions and recommendations.</p>
                        </li>
                        <li>
                            <h3>Step 3: Predictions</h3>
                            <p>Use our prediction tool to estimate your potential salary based on your skills and experience.</p>
                        </li>
                        <li>
                            <h3>Step 4: Recommendations</h3>
                            <p>Receive career suggestions and skill development recommendations based on your profile.</p>
                        </li>
                    </ul>
                </section>
            </div>

            {/*/!* Footer Section with Links *!/*/}
            {/*<footer className="about-footer">*/}
            {/*    <div className="footer-links">*/}
            {/*        <div>*/}
            {/*            <h4>Company</h4>*/}
            {/*            <ul>*/}
            {/*                <li><a href="#">About Us</a></li>*/}
            {/*                <li><a href="#">Careers</a></li>*/}
            {/*                <li><a href="#">Contact</a></li>*/}
            {/*            </ul>*/}
            {/*        </div>*/}
            {/*        <div>*/}
            {/*            <h4>Resources</h4>*/}
            {/*            <ul>*/}
            {/*                <li><a href="#">Blog</a></li>*/}
            {/*                <li><a href="#">Privacy Policy</a></li>*/}
            {/*                <li><a href="#">Terms of Service</a></li>*/}
            {/*            </ul>*/}
            {/*        </div>*/}
            {/*        <div>*/}
            {/*            <h4>Social Media</h4>*/}
            {/*            <ul>*/}
            {/*                <li><a href="#">LinkedIn</a></li>*/}
            {/*                <li><a href="#">Twitter</a></li>*/}
            {/*                <li><a href="#">Facebook</a></li>*/}
            {/*            </ul>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <p className="footer-text">© 2025 CareerBoost. All rights reserved.</p>*/}
            {/*</footer>*/}
        </div>
    );
}

export default AboutUs;
