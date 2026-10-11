import { useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  MapPin,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import projectData from "../../data/projectData";
import { getProjectContent } from "../../api/contentService";
import "./AboutProject.css";

const AboutProject = () => {
  const [project, setProject] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      try {
        const data = await getProjectContent();

        if (isMounted && data) {
          setProject(data);
        }
      } catch (error) {
        console.error("Failed to load project content:", error);
      }
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, []);

  const description = project?.description ?? projectData.description;

  const address = project?.address ?? "Kompally, Hyderabad";

  const locationParts = address.split(",").map((part) => part.trim());
  const locationName = locationParts[0] || "Kompally";
  const cityName = locationParts.slice(1).join(", ") || "Hyderabad";

  const overview = projectData.overview;

  return (
    <section className="about-project section" id="about">
      <div className="container">
        <div className="about-project-grid">
          <div className="about-project-content">
            <span className="section-eyebrow">ABOUT THE PROJECT</span>

            <h2 className="about-project-title">
              A New Perspective
              <br />
              <em>of Modern Living</em>
            </h2>

            <p className="about-project-intro">{description}</p>

            <p className="about-project-text">
              Designed around contemporary lifestyles, Vasavi Bhuvi brings
              together thoughtfully planned residences, landscaped open spaces
              and carefully selected lifestyle amenities within a gated
              community in {locationName}.
            </p>

            <Link to="/about" className="about-project-link">
              Discover More
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="about-project-info">
            <div className="about-project-image">
              <img
                src="/images/about/about-story.jpg"
                alt="Vasavi Bhuvi residential project"
                loading="lazy"
              />

              <div className="about-project-image-label">
                <span>VASAVI</span>
                <strong>BHUVI</strong>
              </div>
            </div>

            <div className="about-project-facts">
              <div className="about-project-fact">
                <div className="about-project-fact-icon">
                  <Ruler size={20} />
                </div>
                <div>
                  <strong>{overview.landArea}</strong>
                  <span>Project Area</span>
                </div>
              </div>

              <div className="about-project-fact">
                <div className="about-project-fact-icon">
                  <Building2 size={20} />
                </div>
                <div>
                  <strong>{overview.totalUnits}</strong>
                  <span>Total Units</span>
                </div>
              </div>

              <div className="about-project-fact">
                <div className="about-project-fact-icon">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <strong>{overview.openSpace}</strong>
                  <span>Open Space</span>
                </div>
              </div>

              <div className="about-project-fact">
                <div className="about-project-fact-icon">
                  <MapPin size={20} />
                </div>
                <div>
                  <strong>{locationName}</strong>
                  <span>{cityName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutProject;
