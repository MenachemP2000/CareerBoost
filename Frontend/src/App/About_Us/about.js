// Import the CSS styles specific to the About component
import "./about.css";

// Import the About image (adjust the path if needed)
import aboutImage from "../images/about.jpg";

// Functional component for the About section
const About = () => {
  // Paragraph text (mission statement)
  const paragraph = `At CareerBoost, we’re on a mission to help you unlock your full career potential. Whether you're a student, a recent graduate, or a seasoned professional looking for a change, our platform provides smart tools to help you move forward with confidence.

From personalized profiles to real-time salary predictions and tailored job matches, we use data and design to guide you toward the right opportunities.`;

  // List items for the left column
  const reasonsLeft = [
    "Smart profiles",
    "Salary insights",
    "Job matching",
    "Easy to use"
  ];

  // List items for the right column
  const reasonsRight = [
    "Trusted by many",
    "Always improving",
    "For every stage",
    "Data-driven tools"
  ];

  return (
      // Main wrapper for the About section
      <section className="about-section">
        <div className="about-container">

          {/* Left side: image section */}
          <div className="about-left">
            <img src={aboutImage} alt="About us" className="about-image" />
          </div>

          {/* Right side: text content */}
          <div className="about-right">
            {/* Section title */}
            <h2 className="section-title">About Us</h2>

            {/* Mission paragraph */}
            <p className="about-description">{paragraph}</p>

            {/* Subtitle for bullet points */}
            <h3 className="about-subtitle">Why Choose Us?</h3>

            {/* Two-column list of reasons */}
            <div className="about-lists">
              {/* Left column */}
              <ul>
                {reasonsLeft.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              {/* Right column */}
              <ul>
                {reasonsRight.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>
  );
};

// Export the component so it can be used in App.js or other pages
export default About;
