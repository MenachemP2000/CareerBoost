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
    text: "Create and manage your professional resume effortlessly."
  },
  {
    image: salaryIcon,
    title: "Salary Prediction",
    text: "Get accurate salary estimates based on your role, location, and background."
  },
  {
    image: compassIcon,
    title: "Job Discovery",
    text: "Explore personalized job opportunities tailored to your strengths."
  },
  {
    image: brainIcon,
    title: "Career Guidance",
    text: "Access tools and tips to help you grow and succeed professionally."
  }
];

// Main Features component
const Features = () => {
  return (
      <section className="features-section">   {/* Wrapper section with heading and grid */}
        <h2 className="section-title">Features</h2>

        <div className="features-grid">        {/* Container for all feature cards */}
          {featuresData.map((item, index) => ( // Loop over features array
              <div className="feature-card" key={index}> {/* Individual feature card */}
                <div className="feature-icon">   {/* Icon wrapper */}
                  <img src={item.image} alt={item.title}/> {/* Feature icon image */}
                </div>
                <h3>{item.title}</h3>            {/* Feature title */}
                <p>{item.text}</p>               {/* Feature description */}
              </div>
          ))}
        </div>
      </section>
  );
};

export default Features; // Export component for use in app
