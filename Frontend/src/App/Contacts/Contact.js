import React from "react";
import "./Contact.css";
import headerImage from "../images/image3.jpg"; // Import image

function ContactUs() {
    return (
        <div className="contact-container">
            {/* Header Section */}
            <div className="contact-header">
                <div className="about-header" style={{ backgroundImage: `url(${headerImage})` }}>
                <h1>Contact Us</h1>
            </div>
            </div>

            {/* Consumer Relations Section */}
            <div className="contact-section">
                <h2>Consumer Relations</h2>
                <p>We value our customers and the communities we serve. We appreciate your questions, comments, and feedback to better serve you.</p>
                <p>Please <a href="#">click here</a> to contact us digitally.</p>
            </div>

            {/* Media Section */}
            <div className="contact-section">
                <h2>Media</h2>
                <p>Press releases and company statements can be found in our <a href="#">Media Center</a>.</p>
                <p>For media inquiries, please <a href="#">click here</a></p>
            </div>

            {/* Careers Section */}
            <div className="contact-section">
                <h2>Careers</h2>
                <p>We have many exciting career opportunities. <a href="#">Click here</a> to explore our open positions.</p>
            </div>

            {/* Additional Information Section */}
            <div className="contact-section">
                <h2>Additional Information</h2>
                <ul>
                    <li><a href="#">Company Store</a></li>
                    <li><a href="#">Media Guidelines</a></li>
                    <li><a href="#">Investor Relations</a></li>
                </ul>
            </div>

            {/* Contact Form */}
            <div className="contact-form">
                <h2>How Can We Help?</h2>
                <form>
                    <label>Topic:</label>
                    <select>
                        <option>I have a question</option>
                        <option>Feedback</option>
                        <option>Support Request</option>
                    </select>

                    <label>Country:</label>
                    <input type="text" placeholder="Enter your country" />

                    <label>First Name:</label>
                    <input type="text" placeholder="Enter your first name" />

                    <label>Last Name:</label>
                    <input type="text" placeholder="Enter your last name" />

                    <label>Email:</label>
                    <input type="email" placeholder="Enter your email" />

                    <label>Message:</label>
                    <textarea placeholder="Write your message..."></textarea>

                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default ContactUs;
