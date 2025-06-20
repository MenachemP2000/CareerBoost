import "./about.css";
import aboutImage from "../images/about.jpg"; // Adjust the path as necessary

const About = () => {
  const paragraph = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
  ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

  const reasonsLeft = [
    "Lorem ipsum dolor",
    "Tempor incididunt",
    "Lorem ipsum dolor",
    "Incididunt ut labore"
  ];

  const reasonsRight = [
    "Aliquip ex ea commodo",
    "Lorem ipsum dolor",
    "Exercitation ullamco",
    "Lorem ipsum dolor"
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
