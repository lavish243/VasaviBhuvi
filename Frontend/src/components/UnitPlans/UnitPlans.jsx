import { Maximize2 } from "lucide-react";
import { unitPlanData } from "../../data/unitPlanData";
import "./UnitPlans.css";

const UnitPlans = () => (
  <section className="unit-plans section" id="unit-plans">
    <div className="container">
      <div className="section-header">
        <span className="section-eyebrow">UNIT PLANS</span>
        <h2 className="section-title">Designed around <em>your life.</em></h2>
        <p className="section-description">Explore representative layouts for the available configurations.</p>
      </div>

      <div className="unit-plans-grid">
        {unitPlanData.map((plan) => (
          <article className="unit-plan-card" key={plan.id}>
            <div className="unit-plan-image-wrapper">
              <img src={plan.image} alt={`${plan.type} unit plan`} loading="lazy" />
              <a href={plan.image} target="_blank" rel="noreferrer" className="unit-plan-expand" aria-label={`Open ${plan.type} plan`}>
                <Maximize2 size={18} />
              </a>
            </div>
            <div className="unit-plan-content">
              <span>{plan.type}</span>
              <h3>{plan.title}</h3>
              <p>{plan.area}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default UnitPlans;
