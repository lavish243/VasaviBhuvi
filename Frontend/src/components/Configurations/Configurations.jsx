import { ArrowUpRight, Maximize2 } from "lucide-react";
import { Link } from "react-router-dom";
import configurationData from "../../data/configurationData";
import "./Configurations.css";

const images = {
  "2 BHK": "/images/floor-plans/2bhk-floor-plan.jpg",
  "2.5 BHK": "/images/floor-plans/2bhk-floor-plan.jpg",
  "3 BHK": "/images/floor-plans/3bhk-floor-plan.jpg",
};

const Configurations = () => (
  <section className="configurations">
    <div className="configurations-container">
      <div className="configurations-header">
        <div>
          <span className="configurations-eyebrow">CONFIGURATIONS</span>
          <h2>Find the space<br /><span>that fits you.</span></h2>
        </div>
        <div className="configurations-header-right">
          <p>Explore thoughtfully planned homes designed around different family sizes and everyday lifestyles.</p>
          <Link to="/floor-plans" className="configurations-view-all">View All Plans <ArrowUpRight size={17} /></Link>
        </div>
      </div>

      <div className="configurations-grid">
        {configurationData.map((configuration) => (
          <article className="configuration-card" key={configuration.id}>
            <div className="configuration-image">
              <img src={images[configuration.type]} alt={`${configuration.type} floor plan`} loading="lazy" />
              <div className="configuration-image-overlay" />
              <span className="configuration-number">{configuration.type}</span>
              <button type="button" className="configuration-expand" aria-label={`View ${configuration.type} plan`}>
                <Maximize2 size={17} />
              </button>
            </div>
            <div className="configuration-content">
              <div>
                <span className="configuration-small-title">CONFIGURATION</span>
                <h3>{configuration.title}</h3>
                <p>{configuration.area}</p>
              </div>
              <div className="configuration-actions">
                <Link to="/floor-plans" className="configuration-plan-link">View Plan <ArrowUpRight size={16} /></Link>
                <Link to="/contact" className="configuration-enquire">Enquire</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Configurations;
