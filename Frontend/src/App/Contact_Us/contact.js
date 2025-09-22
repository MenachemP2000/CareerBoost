// Contact.js
import React, { useState } from "react";
import emailjs from "emailjs-com"; // Library for sending emails directly from client
import "./Contact.css";            // Styles for the contact section

// Contact info displayed on the right side
const contactInfo = {
  email: "info@company.com",
  // address and phone can be added here as needed
};

// Initial state for form inputs
const initialState = {
  name: "",
  email: "",
  message: "",
};

const Contact = () => {
  // Destructure the state values (name, email, message) with setState function
  const [{ name, email, message }, setState] = useState(initialState);

  // Handle changes in input/textarea fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update the state dynamically based on the field name
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  // Reset form back to initial empty state
  const clearState = () => setState({ ...initialState });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Use emailjs to send form data
    emailjs
        .sendForm(
            "service_27vz9v3",       // Your EmailJS service ID
            "template_6fzjhqr",      // Your template ID
            e.target,                // Form element
            "jfmE0kFVWZKuLSES0"      // Your user/public key
        )
        .then(
            (result) => {
              console.log(result.text); // Success response
              clearState();             // Clear the form after sending
            },
            (error) => {
              console.log(error.text);  // Error response
            }
        );
  };

  return (
      <div id="contact" className="contact-section">
        <div className="container">

          {/* Section header */}
          <div className="contact-header">
            <h2>Get in Touch</h2>
            <p>
              Please fill out the form below to send us an email and we will get
              back to you as soon as possible.
            </p>
          </div>

          {/* Grid layout: form on left, info on right */}
          <div className="contact-grid">

            {/* Contact form */}
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleChange}
                    required
                />
              </div>
              <textarea
                  name="message"
                  placeholder="Message"
                  value={message}
                  onChange={handleChange}
                  required
              />
              <button type="submit" className="send-button">
                Send Message
              </button>
            </form>

            {/* Contact info (static details) */}
            <div className="contact-info">
              <h3>Contact Info</h3>
              <p><i className="fa fa-map-marker"></i> {contactInfo.address}</p>
              <p><i className="fa fa-phone"></i> {contactInfo.phone}</p>
              <p><i className="fa fa-envelope"></i> {contactInfo.email}</p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Contact;
