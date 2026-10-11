import { useEffect, useState } from "react";
import {
  MapPin,
  Building2,
  Ruler,
  Home,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

import { getProjectContent } from "../../api/contentService";
import "./ProjectOverview.css";

const defaultOverviewItems = [
  {
    icon: MapPin,
    title: "Location",
    value: "Kompally, Hyderabad",
  },
  {
    icon: Building2,
    title: "Project Scale",
    value: "8 Towers • 17 Floors",
  },
  {
    icon: Home,
    title: "Configurations",
    value: "2, 2.5 & 3 BHK",
  },
  {
    icon: Ruler,
    title: "Project Area",
    value: "10.65 Acres",
  },
  {
    icon: CalendarDays,
    title: "Open Space",
    value: "65% Open Space",
  },
  {
    icon: CheckCircle2,
    title: "Clubhouses",
    value: "2 • 50,000 Sq. Ft.",
  },
];

const ProjectOverview = () => {
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
        console.error("Failed to load project overview:", error);
      }
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, []);

  const address = project?.address || "Kompally, Hyderabad";

  const overviewItems = defaultOverviewItems.map((item) => {
    if (item.title === "Location") {
      return { ...item, value: address };
    }

    return item;
  });

  return (
    <section className="project-overview" id="overview">
      <div className="container">
        <div className="section-header project-overview-header">
          <span className="section-eyebrow">PROJECT OVERVIEW</span>

          <h2 className="section-title">
            Project Overview
            <br />
            <span>
              {project?.name || "Vasavi Bhuvi"}, {address}
            </span>
          </h2>

          <p className="section-description">
            {project?.description ||
              "Introducing the lavish Vasavi Bhuvi at Kompally, Hyderabad, spanning over 10.65 acres with 8 towers, 17 floors each and premium 2, 2.5 and 3 BHK apartments."}
          </p>
        </div>

        <div className="overview-grid">
          {overviewItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div className="overview-card" key={index}>
                <div className="overview-icon">
                  <Icon size={24} strokeWidth={1.7} />
                </div>

                <div className="overview-card-content">
                  <span>{item.title}</span>
                  <strong>{item.value}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectOverview;
