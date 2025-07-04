import "./Features.css";
import chatIcon from "../images/chat.png";
import megaphoneIcon from "../images/megaphone.png";
import supportIcon from "../images/support.png";
import magicwandIcon from "../images/wand.png"; 


const featuresData = [
  {
    image: chatIcon,
    title: "Communication",
    text: "Engage easily with effective communication tools."
  },
  {
    image: megaphoneIcon,
    title: "Promotion",
    text: "Promote your work and reach a wider audience."
  },
  {
    image: supportIcon,
    title: "Collaboration",
    text: "Work together efficiently with team features."
  },
  {
    image: magicwandIcon,
    title: "Customization",
    text: "Personalize your experience effortlessly."
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
