// Contact.js
import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./Contact.css";

const contactInfo = {
  address: "4321 California St, San Francisco, CA 12345",
  phone: "+1 123 456 1234",
  email: "info@company.com",
  facebook: "https://facebook.com/example",
  twitter: "https://twitter.com/example",
  youtube: "https://youtube.com/example"
};

const initialState = {
  name: "",
  email: "",
  message: "",
};

const Contact = () => {
  const [{ name, email, message }, setState] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const clearState = () => setState({ ...initialState });

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .sendForm("service_27vz9v3", "template_6fzjhqr", e.target, "jfmE0kFVWZKuLSES0")
      .then(
        (result) => {
          console.log(result.text);
          clearState();
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <div id="contact" className="contact-section">
      <div className="container">
        <div className="contact-header">
          <h2>Get in Touch</h2>
          <p>
            Please fill out the form below to send us an email and we will get back to you as soon as possible.
          </p>
        </div>
        <div className="contact-grid">
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
            <button type="submit" className="send-button">Send Message</button>
          </form>
          <div className="contact-info">
            <h3>Contact Info</h3>
            <p><i className="fa fa-map-marker"></i> {contactInfo.address}</p>
            <p><i className="fa fa-phone"></i> {contactInfo.phone}</p>
            <p><i className="fa fa-envelope"></i> {contactInfo.email}</p>
          </div>
        </div>
        {/* <div className="social-icons">
          <a href={contactInfo.facebook}><i className="fa fa-facebook"></i></a>
          <a href={contactInfo.twitter}><i className="fa fa-twitter"></i></a>
          <a href={contactInfo.youtube}><i className="fa fa-youtube"></i></a>
        </div> */}
      </div>
    </div>
  );
};

export default Contact;
