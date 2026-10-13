import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import siteConfig from "../../config/siteConfig";
import { getProjectContent } from "../../api/contentService";
import { getPageSection } from "../../services/pageSectionService";
import { resolveImageUrl as resolveApiImageUrl } from "../../api/apiClient";
import "./Hero.css";

const DEFAULT_HERO_IMAGE = "/images/hero/hero-desktop.jpg";

const Hero = () => {
  const [project, setProject] = useState(null);
  const [heroSection, setHeroSection] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getProjectContent()
      .then((data) => {
        if (isMounted) setProject(data);
      })
      .catch((error) => {
        console.error("Failed to load project content:", error);
      });

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

  const apiHeroImage =
    resolveApiImageUrl(heroSection?.imagePath) ||
    resolveApiImageUrl(project?.heroImagePath);

  const heroImage = apiHeroImage || DEFAULT_HERO_IMAGE;

  const handleHeroImageError = (event) => {
    const image = event.currentTarget;

    if (image.dataset.fallbackApplied === "true") return;

    image.dataset.fallbackApplied = "true";
    image.src = DEFAULT_HERO_IMAGE;
  };

  return (
    <section className="hero-section">
      <picture className="hero-background">
        <source
          media="(max-width: 768px)"
          srcSet="/images/hero/hero-mobile.jpg"
        />
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
