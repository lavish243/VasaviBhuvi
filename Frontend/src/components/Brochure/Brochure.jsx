import { ArrowUpRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import siteConfig from "../../config/siteConfig";
import "./Brochure.css";

const Brochure = () => {
  const brochurePath = siteConfig.brochure;
  return (
    <section className="brochure section" id="brochure">
      <div className="container">
        <div className="brochure-wrapper">
          <div className="brochure-content">
            <span className="section-eyebrow">PROJECT BROCHURE</span>
            <h2>Discover Vasavi Bhuvi<br />in Detail</h2>
            <p>Explore the complete project details, floor plans, amenities, specifications and lifestyle features.</p>
            <div className="brochure-actions">
              {brochurePath ? <a href={brochurePath} target="_blank" rel="noopener noreferrer" className="brochure-primary"><BookOpen size={18} />View Brochure<ArrowUpRight size={16} /></a> : <Link to="/contact" className="brochure-primary"><BookOpen size={18} />Request Brochure<ArrowUpRight size={16} /></Link>}
            </div>
          </div>
          <div className="brochure-visual">
            <div className="brochure-card"><div className="brochure-card-top"><span>VASAVI</span><strong>BHUVI</strong></div><div className="brochure-card-center"><span>PROJECT</span><h3>A New Address<br />for Elevated Living</h3><p>Kompally, Hyderabad</p></div><div className="brochure-card-bottom"><span>10.65 ACRES</span><span>8 TOWERS</span><span>1208 UNITS</span></div></div>
            <div className="brochure-decoration brochure-decoration-one" /><div className="brochure-decoration brochure-decoration-two" />
          </div>
        </div>
      </div>
    </section>
  );
};
export default Brochure;
