import { ArrowUpRight, MapPin, Phone, Mail } from "lucide-react";

import { Link } from "react-router-dom";
import siteConfig from "../../config/siteConfig";
import "./Footer.css";

const Footer = () => {
  const phone = siteConfig.contact.phone.replace(/[^\d+]/g, "");
  const social = siteConfig.social || {};

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* =========================
            TOP FOOTER
        ========================== */}
        <div className="footer-top">
          {/* BRAND */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label="Vasavi Bhuvi Home">
              <span className="footer-logo-main">VASAVI</span>

              <span className="footer-logo-sub">BHUVI</span>
            </Link>

            <p className="footer-tagline">
              A thoughtfully designed address for elevated everyday living.
            </p>

            <Link to="/contact" className="footer-enquire">
              <span>Enquire Now</span>

              <ArrowUpRight size={17} strokeWidth={1.8} />
            </Link>
          </div>

          {/* EXPLORE */}
          <div className="footer-column">
            <h4>Explore</h4>

            <Link to="/">Home</Link>

            <Link to="/about">About</Link>

            <Link to="/amenities">Amenities</Link>

            <Link to="/floor-plans">Floor Plans</Link>
          </div>

          {/* DISCOVER */}
          <div className="footer-column">
            <h4>Discover</h4>

            <Link to="/gallery">Gallery</Link>

            <Link to="/location">Location</Link>

            <Link to="/contact">Contact</Link>

            <Link to="/privacy">Privacy Policy</Link>
          </div>

          {/* CONTACT */}
          <div className="footer-column footer-contact">
            <h4>Get In Touch</h4>

            <a href={`tel:${phone}`} className="footer-contact-item">
              <Phone size={17} strokeWidth={1.7} />

              <span>{siteConfig.contact.phone}</span>
            </a>



            <a
              href={siteConfig.maps?.directions || "#"}
              target="_blank"
              rel="noreferrer"
              className="footer-contact-item"
            >
              <MapPin size={17} strokeWidth={1.7} />

              <span>{siteConfig.address}</span>
            </a>
          </div>
        </div>

        {/* =========================
            SOCIAL SECTION
        ========================== */}
        <div className="footer-middle">
          <div className="footer-social-copy">
            <span className="footer-social-title">Follow Vasavi Bhuvi</span>

            <span className="footer-social-description">
              Stay connected with project updates and the latest news.
            </span>
          </div>

          <div className="footer-socials" aria-label="Social media links">
            {social.instagram && (
              <a
                href={social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                Instagram
                <ArrowUpRight size={14} strokeWidth={1.7} />
              </a>
            )}

            {social.facebook && (
              <a
                href={social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                Facebook
                <ArrowUpRight size={14} strokeWidth={1.7} />
              </a>
            )}

            {social.youtube && (
              <a
                href={social.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                YouTube
                <ArrowUpRight size={14} strokeWidth={1.7} />
              </a>
            )}
          </div>
        </div>

        {/* =========================
            BOTTOM
        ========================== */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Vasavi Bhuvi. All rights reserved.</p>

          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>

            <Link to="/terms">Terms &amp; Conditions</Link>
          </div>

          <button
            type="button"
            className="footer-back-top"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <ArrowUpRight size={17} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
