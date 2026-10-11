import { resolveImageUrl } from "../../api/apiClient";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BedDouble,
  Bath,
  Maximize2,
  Download,
} from "lucide-react";

import { getFloorPlans } from "../../api/contentService";
import "./FloorPlans.css";

const FALLBACK_IMAGE = "/images/floor-plans/2bhk-floor-plan.jpg";

const fallbackFloorPlans = [
  {
    id: "2bhk",
    type: "2 BHK",
    label: "SMART LIVING",
    area: "1330 - 1505 Sq. Ft.",
    bedrooms: "2",
    bathrooms: "2",
    balconies: "1",
    image: FALLBACK_IMAGE,
  },
  {
    id: "2-5bhk",
    type: "2.5 BHK",
    label: "FLEXIBLE LIVING",
    area: "1505 Sq. Ft.",
    bedrooms: "2",
    bathrooms: "2",
    balconies: "2",
    image: FALLBACK_IMAGE,
  },
  {
    id: "3bhk",
    type: "3 BHK",
    label: "FAMILY LIVING",
    area: "1695 - 2305 Sq. Ft.",
    bedrooms: "3",
    bathrooms: "3",
    balconies: "2",
    image: "/images/floor-plans/3bhk-floor-plan.jpg",
  },
];

const getApiOrigin = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    console.error("VITE_API_BASE_URL is missing from your .env file.");
    return "";
  }

  return new URL(baseUrl, window.location.origin).origin;
};

const getImageUrl = (imagePath) => resolveImageUrl(imagePath);

const parseFeatures = (featuresJson) => {
  if (Array.isArray(featuresJson)) {
    return featuresJson;
  }

  if (!featuresJson) {
    return [];
  }

  try {
    const parsed = JSON.parse(featuresJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getFeatureCount = (features, keyword, fallback) => {
  const feature = features.find((item) =>
    new RegExp(keyword, "i").test(String(item)),
  );

  const match = String(feature ?? "").match(/\d+/);

  return match ? match[0] : fallback;
};

const mapFloorPlan = (plan, index) => {
  const type = plan.type ?? "2 BHK";
  const features = parseFeatures(plan.featuresJson);

  const bedrooms = type.startsWith("3")
    ? "3"
    : type.startsWith("2.5")
      ? "2"
      : "2";

  const bathrooms = getFeatureCount(
    features,
    "bathroom",
    type.startsWith("3") ? "3" : "2",
  );

  const balconies = getFeatureCount(features, "balcon", "1");

  return {
    id: String(plan.id ?? `${type}-${plan.facing ?? index}`),
    type,
    label: (plan.title || type).toUpperCase(),
    area: `${plan.areaSqFt ?? ""} Sq. Ft.`,
    bedrooms,
    bathrooms,
    balconies,
    image: getImageUrl(plan.imagePath),
    title: plan.title ?? type,
    facing: plan.facing ?? "",
  };
};

const FloorPlans = () => {
  const [floorPlans, setFloorPlans] = useState(fallbackFloorPlans);
  const [activePlan, setActivePlan] = useState(fallbackFloorPlans[0]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadFloorPlans = async () => {
      try {
        setLoading(true);
        setApiError("");

        const response = await getFloorPlans();

        const records = Array.isArray(response)
          ? response
          : Array.isArray(response?.items)
            ? response.items
            : Array.isArray(response?.data)
              ? response.data
              : [];

        if (cancelled) return;

        if (records.length === 0) {
          setFloorPlans(fallbackFloorPlans);
          setActivePlan(fallbackFloorPlans[0]);
          return;
        }

        const mappedPlans = records.map(mapFloorPlan);

        setFloorPlans(mappedPlans);
        setActivePlan(mappedPlans[0]);
      } catch (error) {
        console.error("Failed to load floor plans:", error);

        if (!cancelled) {
          setApiError(
            "Unable to load the latest floor plans. Showing sample plans.",
          );
          setFloorPlans(fallbackFloorPlans);
          setActivePlan(fallbackFloorPlans[0]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadFloorPlans();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleImageError = (event) => {
    const image = event.currentTarget;

    if (!image.dataset.fallbackApplied) {
      image.dataset.fallbackApplied = "true";
      image.src = FALLBACK_IMAGE;
    }
  };

  const activeIndex = floorPlans.findIndex((plan) => plan.id === activePlan.id);

  return (
    <main className="floor-plans-page">
      {/* HERO */}
      <section
        className="fp-hero"
        style={{
          backgroundImage:
            "url('/images/floor-plans/floor-plan-lifestyle.jpg')",
        }}
      >
        <div className="fp-hero-content">
          <span className="fp-eyebrow">RESIDENCES &amp; FLOOR PLANS</span>

          <h1>
            Space
            <span> well considered.</span>
          </h1>

          <p className="fp-hero-description">
            Explore thoughtfully planned residences created around comfort,
            light and everyday living.
          </p>
        </div>

        <div className="fp-scroll">
          <span>EXPLORE PLANS</span>
          <ArrowDown size={18} />
        </div>
      </section>

      {/* INTRO */}
      <section className="fp-intro">
        <div className="fp-intro-grid">
          <div>
            <div className="fp-section-label">
              <span>01</span>
              <span>THE RESIDENCES</span>
            </div>

            <h2>
              Rooms that
              <em> feel right.</em>
            </h2>
          </div>

          <div className="fp-intro-copy">
            <p>
              Every residence is planned to make the most of its available space
              while keeping everyday movement natural and comfortable.
            </p>

            <p>
              Explore the available configurations below and discover the layout
              that best matches your requirements.
            </p>
          </div>
        </div>
      </section>

      {/* PLAN SELECTOR */}
      <section className="fp-plans-section">
        <div className="fp-plans-header">
          <div>
            <div className="fp-section-label">
              <span>02</span>
              <span>EXPLORE CONFIGURATIONS</span>
            </div>

            <h2>Find your configuration.</h2>
          </div>

          <p>
            Choose from thoughtfully planned residences designed for comfortable
            modern living.
          </p>
        </div>

        {loading && <p role="status">Loading floor plans...</p>}

        {apiError && <p role="status">{apiError}</p>}

        {/* DYNAMIC PLAN TABS */}
        <div className="fp-plan-tabs">
          {floorPlans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              className={`fp-plan-tab ${
                activePlan.id === plan.id ? "active" : ""
              }`}
              onClick={() => setActivePlan(plan)}
            >
              {plan.type}
              {plan.facing ? ` - ${plan.facing}` : ""}
            </button>
          ))}
        </div>

        {/* ACTIVE PLAN */}
        <div className="fp-active-plan">
          <div className="fp-plan-image">
            <img
              src={activePlan.image}
              alt={`${activePlan.title || activePlan.type} floor plan`}
              onError={handleImageError}
            />

            <span className="fp-plan-image-number">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="fp-plan-details">
            <div className="fp-section-label">
              <span>{activePlan.label}</span>
            </div>

            <h3>{activePlan.title || activePlan.type}</h3>

            {activePlan.facing && <p>{activePlan.facing} Facing</p>}

            <p>
              A carefully planned residence balancing private spaces, shared
              living areas and natural movement throughout the home.
            </p>

            {/* SPECIFICATIONS */}
            <div className="fp-plan-meta">
              <div className="fp-meta-item">
                <Maximize2 className="fp-meta-icon" />
                <div>
                  <span className="fp-meta-label">AREA</span>
                  <strong className="fp-meta-value">{activePlan.area}</strong>
                </div>
              </div>

              <div className="fp-meta-item">
                <BedDouble className="fp-meta-icon" />
                <div>
                  <span className="fp-meta-label">BEDROOMS</span>
                  <strong className="fp-meta-value">
                    {activePlan.bedrooms}
                  </strong>
                </div>
              </div>

              <div className="fp-meta-item">
                <Bath className="fp-meta-icon" />
                <div>
                  <span className="fp-meta-label">BATHROOMS</span>
                  <strong className="fp-meta-value">
                    {activePlan.bathrooms}
                  </strong>
                </div>
              </div>

              <div className="fp-meta-item">
                <Maximize2 className="fp-meta-icon" />
                <div>
                  <span className="fp-meta-label">BALCONIES</span>
                  <strong className="fp-meta-value">
                    {activePlan.balconies}
                  </strong>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="fp-plan-actions">
              <a href="/contact" className="fp-primary-btn">
                Enquire About This Plan
                <ArrowUpRight size={17} />
              </a>

              <a href={activePlan.image} download className="fp-secondary-btn">
                <Download size={16} />
                Download Plan
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ALL CONFIGURATIONS */}
      <section className="fp-configurations">
        <div className="fp-configurations-heading">
          <div>
            <div className="fp-section-label">
              <span>03</span>
              <span>ALL CONFIGURATIONS</span>
            </div>

            <h2>
              Choose the
              <span> right plan.</span>
            </h2>
          </div>

          <p>
            Compare the available configurations and explore the spaces designed
            for different styles of living.
          </p>
        </div>

        <div className="fp-config-grid">
          {floorPlans.map((plan, index) => (
            <article
              key={plan.id}
              className={`fp-config-card ${
                activePlan.id === plan.id ? "active" : ""
              }`}
              onClick={() => setActivePlan(plan)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActivePlan(plan);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="fp-config-image">
                <img
                  src={plan.image}
                  alt={`${plan.title || plan.type} floor plan`}
                  loading="lazy"
                  onError={handleImageError}
                />

                <span className="fp-config-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="fp-config-content">
                <p>{plan.label}</p>

                <h3>{plan.title || plan.type}</h3>

                <p>
                  {plan.bedrooms} Bedrooms &nbsp;•&nbsp;
                  {plan.bathrooms} Bathrooms &nbsp;•&nbsp;
                  {plan.balconies} Balconies
                </p>

                {plan.facing && <p>{plan.facing} Facing</p>}

                <span className="fp-config-link">
                  VIEW PLAN
                  <ArrowUpRight size={15} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* DESIGN / LIFESTYLE */}
      <section className="fp-design">
        <div className="fp-design-grid">
          <div
            className="fp-design-image"
            style={{
              backgroundImage:
                "url('/images/floor-plans/floor-plan-lifestyle.jpg')",
            }}
          />

          <div className="fp-design-content">
            <div className="fp-section-label">
              <span>BEYOND THE FLOOR PLAN</span>
            </div>

            <h2>
              Designed for
              <span> real life.</span>
            </h2>

            <p>
              The best floor plan is not simply about measurements. It is about
              how naturally a home supports the way you live.
            </p>

            <ul className="fp-design-list">
              <li>Thoughtful circulation</li>
              <li>Comfortable private spaces</li>
              <li>Connected living areas</li>
              <li>Light-filled interiors</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="fp-cta"
        style={{
          backgroundImage:
            "url('/images/floor-plans/floor-plan-lifestyle.jpg')",
        }}
      >
        <div className="fp-cta-content">
          <div className="fp-section-label">
            <span>FIND YOUR FUTURE HOME</span>
          </div>

          <h2>
            Have questions
            <span> about the plans?</span>
          </h2>

          <p>
            Speak with our team for detailed floor plans, availability,
            specifications and project information.
          </p>

          <a href="/contact" className="fp-primary-btn">
            Talk To Us
            <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
    </main>
  );
};

export default FloorPlans;
