import {
  Building2,
  Home,
  Layers3,
  Trees,
  Waves,
  Maximize2,
} from "lucide-react";

import "./ProjectStats.css";

const stats = [
  {
    value: "10.65",
    suffix: " Acres",
    label: "Total Project Area",
    icon: Maximize2,
  },
  {
    value: "1,208",
    suffix: "",
    label: "Premium Homes",
    icon: Home,
  },
  {
    value: "8",
    suffix: "",
    label: "Residential Towers",
    icon: Building2,
  },
  {
    value: "17",
    suffix: " Floors",
    label: "Per Tower",
    icon: Layers3,
  },
  {
    value: "65%",
    suffix: "",
    label: "Open Space",
    icon: Trees,
  },
  {
    value: "50,000",
    suffix: " Sq. Ft.",
    label: "Clubhouses",
    icon: Waves,
  },
];

const ProjectStats = () => {
  return (
    <section className="project-stats">
      <div className="project-stats-container">
        {/* SECTION HEADER */}

        <div className="project-stats-header">
          <div>
            <span className="project-stats-eyebrow">PROJECT HIGHLIGHTS</span>

            <h2>
              Designed around
              <br />
              <span>the way you live.</span>
            </h2>
          </div>

          <p>
            A thoughtfully planned residential community combining spacious
            homes, landscaped open areas and lifestyle amenities across a
            well-designed development.
          </p>
        </div>

        {/* STATS GRID */}

        <div className="project-stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div className="project-highlight" key={stat.label}>
                <div className="project-highlight-top">
                  <Icon size={22} strokeWidth={1.4} />
                </div>

                <div className="project-highlight-number">
                  <strong>{stat.value}</strong>

                  {stat.suffix && <span>{stat.suffix}</span>}
                </div>

                <div className="project-highlight-label">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* CONFIGURATION STRIP */}

        <div className="project-configuration">
          <div className="project-configuration-title">
            <span>CONFIGURATIONS</span>
            <strong>Homes for different ways of living</strong>
          </div>

          <div className="project-configuration-options">
            <div>
              <strong>2 BHK</strong>
              <span>Thoughtfully planned homes</span>
            </div>

            <div>
              <strong>2.5 BHK</strong>
              <span>Flexible family spaces</span>
            </div>

            <div>
              <strong>3 BHK</strong>
              <span>Generous living spaces</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectStats;
