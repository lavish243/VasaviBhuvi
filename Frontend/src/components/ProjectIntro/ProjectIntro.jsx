import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import siteConfig from "../../config/siteConfig";
import "./ProjectIntro.css";

const ProjectIntro = () => {
  return (
    <section className="project-intro">
      <div className="project-intro-container">
        {/* LEFT CONTENT */}
        <div className="project-intro-content">
          <span className="project-intro-eyebrow">ABOUT THE PROJECT</span>

          <h2>
            A new way
            <br />
            <span>to live beautifully.</span>
          </h2>

          <p className="project-intro-lead">
            Vasavi Bhuvi is thoughtfully envisioned as a contemporary
            residential community where architecture, nature and everyday
            comfort come together.
          </p>

          <p className="project-intro-text">
            Designed for modern families, the project brings together carefully
            planned homes, landscaped spaces and lifestyle amenities in a
            well-connected location. Every detail is considered to create a
            balanced environment for living, relaxing and growing.
          </p>

          <Link to="/about" className="project-intro-button">
            Explore Project
            <ArrowUpRight size={18} />
          </Link>
        </div>

        {/* RIGHT IMAGE */}
        <div className="project-intro-visual">
          <div className="project-intro-image-wrap">
            <img
              src="/images/about/about-story.jpg"
              alt={`${siteConfig.projectName} project`}
            />
          </div>

          <div className="project-intro-location">
            <span>LOCATION</span>
            <strong>
              {siteConfig.location.area}, {siteConfig.location.city}
            </strong>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="project-intro-stats">
        <div className="project-stat">
          <strong>Premium</strong>
          <span>Residential Living</span>
        </div>

        <div className="project-stat">
          <strong>Thoughtfully</strong>
          <span>Planned Spaces</span>
        </div>

        <div className="project-stat">
          <strong>Modern</strong>
          <span>Lifestyle Amenities</span>
        </div>

        <div className="project-stat">
          <strong>Connected</strong>
          <span>Prime Location</span>
        </div>
      </div>
    </section>
  );
};

export default ProjectIntro;
