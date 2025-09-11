import "./Features.css";
import resumeIcon from "../images/resume.png"; // Assuming you have a resume icon
import salaryIcon from "../images/salary.png"; // Assuming you have a salary icon
import compassIcon from "../images/compass.png"; // Assuming you have a compass icon
import brainIcon from "../images/brain-organ.png"; // Assuming you have a brain icon
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

const Features = () => {
  return (
    <section className="features-section">
      <h2 className="section-title">Features</h2>
      <div className="features-grid">
        {featuresData.map((item, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">
              <img src={item.image} alt={item.title}/>
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
