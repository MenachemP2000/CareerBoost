import "./about.css";
import aboutImage from "../images/about.jpg"; // Adjust the path as necessary

const About = () => {
  const paragraph = `At CareerBoost, we’re on a mission to help you unlock your full career potential. Whether you're a student, a recent graduate, or a seasoned professional looking for a change, our platform provides smart tools to help you move forward with confidence.

From personalized profiles to real-time salary predictions and tailored job matches, we use data and design to guide you toward the right opportunities.`;

  const reasonsLeft = [
    "Smart profiles",
    "Salary insights",
    "Job matching",
    "Easy to use"
  ];

  const reasonsRight = [
    "Trusted by many",
    "Always improving",
    "For every stage",
    "Data-driven tools"
  ];

  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-left">
          <img src={aboutImage} alt="About us" className="about-image" />
        </div>
        <div className="about-right">
          <h2 className="section-title">About Us</h2>
          <p className="about-description">{paragraph}</p>

          <h3 className="about-subtitle">Why Choose Us?</h3>
          <div className="about-lists">
            <ul>
              {reasonsLeft.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
            <ul>
              {reasonsRight.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
