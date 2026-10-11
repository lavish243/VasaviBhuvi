import { ExternalLink, Play } from "lucide-react";
import { Link } from "react-router-dom";
import siteConfig from "../../config/siteConfig";
import "./ProjectWalkthrough.css";

const ProjectWalkthrough = () => {
  const hasVideo = Boolean(siteConfig.walkthroughVideoId);
  const videoUrl = hasVideo ? `https://www.youtube.com/watch?v=${siteConfig.walkthroughVideoId}` : "";
  return (
    <section className="project-walkthrough section" id="walkthrough">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">EXPERIENCE BHUVI</span>
          <h2 className="section-title">Project Walkthrough</h2>
          <p className="section-description">Take a virtual tour of Vasavi Bhuvi and explore the architecture, residences, landscaped spaces and lifestyle amenities.</p>
        </div>
        <div className="walkthrough-video-wrapper">
          <div className="walkthrough-video">
            {hasVideo ? <iframe src={`https://www.youtube.com/embed/${siteConfig.walkthroughVideoId}`} title="Vasavi Bhuvi Project Walkthrough" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> : <img src="/images/hero/hero-desktop.jpg" alt="Vasavi Bhuvi project" loading="lazy" />}
            {hasVideo && <div className="walkthrough-play"><Play size={22} fill="currentColor" /></div>}
          </div>
        </div>
        <div className="walkthrough-footer">
          <div><span>VASAVI BHUVI</span><p>Premium residential living at Kompally, Hyderabad.</p></div>
          {hasVideo ? <a href={videoUrl} target="_blank" rel="noreferrer" className="walkthrough-link">Watch on YouTube<ExternalLink size={16} /></a> : <Link to="/contact" className="walkthrough-link">Request Project Details<ExternalLink size={16} /></Link>}
        </div>
      </div>
    </section>
  );
};
export default ProjectWalkthrough;
