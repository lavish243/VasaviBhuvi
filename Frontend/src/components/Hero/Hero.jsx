import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import siteConfig from "../../config/siteConfig";
import { getProjectContent } from "../../api/contentService";
import { getPageSection } from "../../services/pageSectionService";
import "./Hero.css";

const Hero = () => {
  const [project, setProject] = useState(null);
  const [heroSection, setHeroSection] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Keep the existing project API.
    getProjectContent()
      .then((data) => {
        if (isMounted) setProject(data);
      })
      .catch((error) => {
        console.error("Failed to load project content:", error);
      });

    // Load the published Hero section from the new API.
    getPageSection("hero")
      .then((data) => {
        if (isMounted) setHeroSection(data);
      })
      .catch((error) => {
        console.error("Failed to load hero section:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const projectName =
    heroSection?.title || project?.name || siteConfig.projectName;

  const tagline =
    heroSection?.description || project?.tagline || siteConfig.tagline;

  const address =
    project?.address ||
    `${siteConfig.location.area}, ${siteConfig.location.city}`;

  const rera = project?.reraNumber || siteConfig.rera;
  const brochure = project?.brochurePath || siteConfig.brochure;

  const subtitle = heroSection?.subtitle || "Premium Residential Project";

  const buttonText = heroSection?.buttonText || "Enquire Now";
  const buttonUrl = heroSection?.buttonUrl || "/contact";

  const resolveImageUrl = (path) => {
    if (!path) return "";

    if (/^https?:\/\//i.test(path)) return path;

    const apiBase = (
      import.meta.env.VITE_API_BASE_URL || "https://vasavi-bhuvi-api.onrender.com"
    ).replace(/\/+$/, "");

    const origin = apiBase.replace(/\/api$/i, "");

    return `${origin}/${path.replace(/^\/+/, "")}`;
  };

  const heroImage =
    resolveImageUrl(heroSection?.imagePath) ||
    resolveImageUrl(project?.heroImagePath) ||
    "https://vasavibhuvi.com/images/new/block-entrance-6661678486813.webp";

  const handleHeroImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src =
      "https://vasavibhuvi.com/images/new/block-entrance-6661678486813.webp";
  };

  return (
    <section className="hero-section">
      <picture className="hero-background">
        <source media="(max-width: 768px)" srcSet={heroImage} />
        <img
          src={heroImage}
          alt={`${projectName} residential project`}
          onError={handleHeroImageError}
        />
      </picture>

      <div className="hero-overlay" />

      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-line" />
          <span>
            {heroSection?.subtitle || siteConfig.developerName || subtitle}
          </span>
        </div>

        <h1>{projectName}</h1>

        <p className="hero-location">{address}</p>

        <p className="hero-description">{tagline}</p>

        <div className="hero-actions">
          <Link to={buttonUrl} className="hero-primary-button">
            {buttonText}
            <ArrowUpRight size={18} />
          </Link>

          <a
            href={brochure}
            className="hero-secondary-button"
            target="_blank"
            rel="noreferrer"
          >
            <Download size={17} />
            Download Brochure
          </a>
        </div>
      </div>

      <div className="hero-bottom">
        <div className="hero-scroll">
          <span>Scroll to explore</span>
          <ArrowDown size={17} />
        </div>

        <div className="hero-rera">
          RERA No. {rera || "Contact for details"}
        </div>
      </div>
    </section>
  );
};

export default Hero;
