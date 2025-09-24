import { Link } from "react-router-dom";
import "./Features.css";                           // Import styles for this section
import resumeIcon from "../images/resume.png";     // Resume feature icon
import salaryIcon from "../images/salary.png";     // Salary prediction icon
import compassIcon from "../images/compass.png";   // Job discovery icon
import brainIcon from "../images/brain-organ.png"; // Career guidance icon

// Data array: each object represents a feature card
// Includes an image, a title, and a short descriptive text
const featuresData = [
  {
    image: resumeIcon,
    title: "Profile Building",
    text: "Create and manage your professional resume effortlessly.",
    path: "/profile"
  },
  {
    image: salaryIcon,
    title: "Salary Prediction",
    text: "Get accurate salary estimates based on your role, location, and background.",
    path: "/prediction"
  },
  {
    image: compassIcon,
    title: "Job Discovery",
    text: "Explore personalized job opportunities tailored to your strengths.",
    path: "/savedjobs"
  },
  {
    image: brainIcon,
    title: "Career Guidance",
    text: "Access tools and tips to help you grow and succeed professionally.",
    path: "/Recommendations"
  }
];

// Main Features component
const Features = () => {
  return (
      <section className="features-section">
        <h2 className="section-title">Features</h2>

        <div className="features-grid">
          {featuresData.map((item, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">
                  {/* Wrap the icon in a Link */}
                  <Link to={item.path}>
                    <img src={item.image} alt={item.title}/>
                  </Link>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
          ))}
        </div>
      </section>
  )
      ;
};

export default Features; // Export component for use in app
