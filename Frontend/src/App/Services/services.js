import "./services.css";

const servicesList = [
  {
    icon: "fa fa-wordpress",
    name: "WordPress Solutions",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare diam."
  },
  {
    icon: "fa fa-shopping-cart",
    name: "E-Commerce",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare diam."
  },
  {
    icon: "fa fa-cloud-download",
    name: "Cloud Integration",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare diam."
  },
  {
    icon: "fa fa-language",
    name: "Translation",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare diam."
  },
  {
    icon: "fa fa-plane",
    name: "Travel Planning",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare diam."
  },
  {
    icon: "fa fa-pie-chart",
    name: "Analytics",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare diam."
  }
];

const Services = () => {
  return (
    <div id="services" className="services-section">
      <div className="container">
        <div className="section-title">
          <h2>Our Services</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit duis sed
            dapibus leonec.
          </p>
        </div>
        <div className="services-grid">
          {servicesList.map((service, i) => (
            <div className="service-card" key={i}>
              <div className="service-icon">
                <i className={service.icon}></i>
              </div>
              <h3>{service.name}</h3>
              <p>{service.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
