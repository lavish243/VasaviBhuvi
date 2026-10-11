import { useState } from "react";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
import "./MasterPlan.css";

const MasterPlan = () => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <>
      <section className="master-plan-section" id="master-plan">
        <div className="master-plan-container">
          {/* Heading */}
          <div className="master-plan-heading">
            <div>
              <span className="master-plan-eyebrow">MASTER PLAN</span>

              <h2>
                Designed around
                <br />
                <em>the way you live.</em>
              </h2>
            </div>

            <div className="master-plan-heading-text">
              <p>
                Explore the thoughtfully planned layout of the project, designed
                to bring together residences, landscaped spaces, lifestyle
                amenities and community areas.
              </p>
            </div>
          </div>

          {/* Plan */}
          <div className="master-plan-layout">
            <div
              className="master-plan-image-wrap"
              onClick={() => setIsViewerOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  setIsViewerOpen(true);
                }
              }}
            >
              <img
                src="/images/master-plan/master-plan.jpg"
                alt="Vasavi Bhuvi master plan"
                className="master-plan-image"
              />

              <div className="master-plan-image-overlay">
                <span>
                  <Maximize2 size={18} />
                  View Full Plan
                </span>
              </div>
            </div>

            {/* Side information */}
            <aside className="master-plan-info">
              <span className="master-plan-info-label">PROJECT LAYOUT</span>

              <h3>
                A community planned
                <br />
                with purpose.
              </h3>

              <p>
                The master plan brings the residential towers, open spaces and
                lifestyle areas together within a connected community
                environment.
              </p>

              <div className="master-plan-highlights">
                <div className="master-plan-highlight">
                  <span className="highlight-number">08</span>
                  <span className="highlight-label">
                    Residential
                    <br />
                    Towers
                  </span>
                </div>

                <div className="master-plan-highlight">
                  <span className="highlight-number">65%</span>
                  <span className="highlight-label">
                    Open
                    <br />
                    Space
                  </span>
                </div>

                <div className="master-plan-highlight">
                  <span className="highlight-number">02</span>
                  <span className="highlight-label">Clubhouses</span>
                </div>
              </div>

              <button
                type="button"
                className="master-plan-view-button"
                onClick={() => setIsViewerOpen(true)}
              >
                <span>View Master Plan</span>
                <ArrowUpRight size={18} />
              </button>
            </aside>
          </div>
        </div>
      </section>

      {/* Fullscreen Viewer */}
      {isViewerOpen && (
        <div
          className="master-plan-viewer"
          role="dialog"
          aria-modal="true"
          aria-label="Master plan viewer"
          onClick={() => setIsViewerOpen(false)}
        >
          <button
            type="button"
            className="master-plan-close"
            aria-label="Close master plan"
            onClick={() => setIsViewerOpen(false)}
          >
            <X size={28} />
          </button>

          <div
            className="master-plan-viewer-content"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src="/images/master-plan/master-plan.jpg"
              alt="Vasavi Bhuvi master plan enlarged"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MasterPlan;
