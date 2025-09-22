import "./services.css";

/* --------------------------------
   Static data for services section
   Each service has:
   - icon (FontAwesome class)
   - name (title text)
   - text (description)
--------------------------------- */
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

/* --------------------------------
   Services Component
   Renders:
   - Section header (title + subtitle)
   - Grid of service cards
--------------------------------- */
const Services = () => {
  return (
      <div id="services" className="services-section">
        <div className="container">
          {/* Section Header */}
          <div className="section-title">
            <h2><span>Our Services</span></h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit duis sed
              dapibus leonec.
            </p>
          </div>

          {/* Services Grid */}
          <div className="services-grid">
            {servicesList.map((service, i) => (
                <div className="service-card" key={i}>
                  {/* Icon (FontAwesome) */}
                  <div className="service-icon">
                    <i className={service.icon}></i>
                  </div>
                  {/* Service title + description */}
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
