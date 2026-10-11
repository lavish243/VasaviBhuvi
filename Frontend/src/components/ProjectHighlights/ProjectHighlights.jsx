import { ShieldCheck, Trees, Dumbbell, Car, Waves, Zap } from "lucide-react";

import "./ProjectHighlights.css";

const highlights = [
  {
    icon: ShieldCheck,
    number: "01",
    title: "Secure Community",
    description:
      "A thoughtfully planned residential environment with security and controlled access.",
  },
  {
    icon: Trees,
    number: "02",
    title: "Green Spaces",
    description:
      "Landscaped spaces designed to bring nature and a refreshing environment closer to home.",
  },
  {
    icon: Dumbbell,
    number: "03",
    title: "Lifestyle Amenities",
    description:
      "Well-planned lifestyle facilities designed for recreation, fitness and relaxation.",
  },
  {
    icon: Car,
    number: "04",
    title: "Convenient Parking",
    description:
      "Dedicated parking provisions designed for everyday convenience of residents and visitors.",
  },
  {
    icon: Waves,
    number: "05",
    title: "Leisure Spaces",
    description:
      "Spaces designed for residents to unwind, connect and enjoy their free time.",
  },
  {
    icon: Zap,
    number: "06",
    title: "Modern Infrastructure",
    description:
      "Contemporary infrastructure planned around comfortable and convenient living.",
  },
];

const ProjectHighlights = () => {
  return (
    <section className="project-highlights" id="highlights">
      <div className="container">
        <div className="highlights-heading">
          <div>
            <span className="section-eyebrow">PROJECT HIGHLIGHTS</span>

            <h2 className="section-title">
              Designed Around
              <br />
              <span>Better Living</span>
            </h2>
          </div>

          <p className="section-description">
            Every detail is thoughtfully planned to create a comfortable,
            convenient and contemporary residential experience.
          </p>
        </div>

        <div className="highlights-grid">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <article className="highlight-card" key={item.number}>
                <div className="highlight-top">
                  <span className="highlight-number">{item.number}</span>

                  <div className="highlight-icon">
                    <Icon size={25} strokeWidth={1.6} />
                  </div>
                </div>

                <div className="highlight-content">
                  <h3>{item.title}</h3>

                  <p>{item.description}</p>
                </div>

                <div className="highlight-line"></div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectHighlights;
