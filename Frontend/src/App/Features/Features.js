import React from "react";
import "./Features.css";

const featuresData = [
  {
    image: "../images/chat.png",
    title: "Communication",
    text: "Engage easily with effective communication tools."
  },
  {
    icon: "fa fa-bullhorn",
    title: "Promotion",
    text: "Promote your work and reach a wider audience."
  },
  {
    icon: "fa fa-users",
    title: "Collaboration",
    text: "Work together efficiently with team features."
  },
  {
    icon: "fa fa-magic",
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
