import { resolveImageUrl } from "../../api/apiClient";
import { useEffect, useMemo, useState } from "react";
import {
  Maximize2,
  CheckCircle2,
  ArrowUpRight,
  Download,
  X,
} from "lucide-react";

import floorPlanData from "../../data/floorPlanData";
import { getFloorPlans } from "../../api/contentService";
import "./FloorPlans.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://vasavi-bhuvi-api.onrender.com/api"
).replace(/\/+$/, "");

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/i, "");

const getImageUrl = (path) => resolveImageUrl(path);

const normalizePlan = (plan, index) => {
  let features = plan.features ?? plan.featuresJson ?? [];

  if (typeof features === "string") {
    try {
      features = JSON.parse(features);
    } catch {
      features = [];
    }
  }

  if (!Array.isArray(features)) {
    features = [];
  }

  const areaValue = plan.area ?? plan.areaSqFt;

  return {
    ...plan,
    id: plan.id ?? plan.Id ?? `floor-plan-${index}`,
    type: plan.type ?? plan.Type ?? "",
    title: plan.title ?? plan.Title ?? "",
    area:
      areaValue != null
        ? typeof areaValue === "number"
          ? `${areaValue.toLocaleString("en-IN")} Sq. Ft.`
          : areaValue
        : "",
    image: getImageUrl(plan.image ?? plan.imagePath ?? plan.ImagePath),
    features,
  };
};

const FloorPlans = () => {
  const [activeType, setActiveType] = useState("All");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState(() => floorPlanData.map(normalizePlan));
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  const filters = ["All", "2 BHK", "2.5 BHK", "3 BHK"];

  useEffect(() => {
    let isMounted = true;

    getFloorPlans()
      .then((data) => {
        if (!isMounted) return;

        const records = Array.isArray(data) ? data : data?.items;

        if (Array.isArray(records)) {
          setPlans(records.map(normalizePlan));
          setApiError(false);
        } else {
          setApiError(true);
        }
      })
      .catch((error) => {
        console.error("Failed to load floor plans:", error);
        if (isMounted) setApiError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPlans = useMemo(() => {
    if (activeType === "All") return plans;

    return plans.filter((plan) => plan.type === activeType);
  }, [activeType, plans]);

  const closeModal = () => setSelectedPlan(null);

  return (
    <section className="floor-plans" id="floor-plans">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Residence Options</span>

          <h2 className="section-title">Floor Plans</h2>

          <p className="section-description">
            Explore thoughtfully designed 2, 2.5 and 3 BHK residences available
            at Vasavi Bhuvi.
          </p>
        </div>

        <div className="floor-plan-filters">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`floor-plan-filter ${
                activeType === filter ? "active" : ""
              }`}
              onClick={() => setActiveType(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {loading && <p role="status">Loading floor plans...</p>}

        {apiError && (
          <p role="status">
            Showing available floor plans. Live data could not be refreshed.
          </p>
        )}

        <div className="floor-plan-grid">
          {filteredPlans.length > 0
            ? filteredPlans.map((plan) => (
                <article key={plan.id} className="floor-plan-card">
                  <div className="floor-plan-image-wrapper">
                    {plan.image ? (
                      <img
                        src={plan.image}
                        alt={`${plan.title} floor plan`}
                        className="floor-plan-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="floor-plan-empty">
                        <p>Floor plan image not available</p>
                      </div>
                    )}

                    <button
                      type="button"
                      className="floor-plan-view"
                      onClick={() => setSelectedPlan(plan)}
                      aria-label={`View ${plan.title} floor plan`}
                    >
                      <Maximize2 size={18} />
                    </button>
                  </div>

                  <div className="floor-plan-card-content">
                    <div className="floor-plan-card-top">
                      <div>
                        <span className="floor-plan-type">{plan.type}</span>
                        <h3>{plan.title}</h3>
                      </div>

                      <span className="floor-plan-area">{plan.area}</span>
                    </div>

                    {plan.features.length > 0 && (
                      <div className="floor-plan-features">
                        {plan.features.map((feature, index) => (
                          <div
                            className="floor-plan-feature"
                            key={`${plan.id}-feature-${index}`}
                          >
                            <CheckCircle2 size={16} />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="floor-plan-actions">
                      <button
                        type="button"
                        className="floor-plan-inquire"
                        onClick={() => {
                          window.location.href = `/contact?configuration=${encodeURIComponent(plan.type)}`;
                        }}
                      >
                        <span>Inquire About This Plan</span>
                        <ArrowUpRight size={15} />
                      </button>

                      <button
                        type="button"
                        className="floor-plan-download"
                        aria-label={`Download ${plan.title} floor plan`}
                        onClick={() => {
                          if (!plan.image) return;

                          const link = document.createElement("a");
                          link.href = plan.image;
                          link.download = `${plan.title || "floor-plan"}.jpg`;
                          link.target = "_blank";
                          link.rel = "noreferrer";
                          link.click();
                        }}
                        disabled={!plan.image}
                      >
                        <Download size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            : !loading && (
                <div className="floor-plan-empty">
                  <h3>No Floor Plans Found</h3>
                  <p>No floor plans are available for this configuration.</p>
                </div>
              )}
        </div>
      </div>

      {selectedPlan && (
        <div
          className="floor-plan-modal"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Floor plan preview"
        >
          <div
            className="floor-plan-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="floor-plan-modal-close"
              onClick={closeModal}
              aria-label="Close floor plan preview"
            >
              <X size={22} />
            </button>

            {selectedPlan.image && (
              <img
                src={selectedPlan.image}
                alt={`${selectedPlan.title} floor plan`}
              />
            )}

            <div className="floor-plan-modal-info">
              <span>{selectedPlan.type}</span>
              <h3>{selectedPlan.title}</h3>
              <p>{selectedPlan.area}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FloorPlans;
