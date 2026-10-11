import React from "react";
import {
  ArrowDown,
  ArrowUpRight,
  MapPin,
  Navigation,
  School,
  Hospital,
  ShoppingBag,
  BriefcaseBusiness,
  Plane,
  TrainFront,
} from "lucide-react";

import "./Location.css";

const locationHighlights = [
  {
    icon: School,
    title: "Education",
    text: "Schools, colleges and educational institutions within convenient reach.",
  },
  {
    icon: Hospital,
    title: "Healthcare",
    text: "Access to hospitals, clinics and essential healthcare facilities.",
  },
  {
    icon: ShoppingBag,
    title: "Shopping",
    text: "Retail destinations, supermarkets and everyday conveniences nearby.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Business Hubs",
    text: "Convenient connectivity to important employment and commercial districts.",
  },
  {
    icon: Plane,
    title: "Airport",
    text: "Convenient access to the city's airport and regional connectivity.",
  },
  {
    icon: TrainFront,
    title: "Transport",
    text: "Strong road and public-transport connectivity for everyday travel.",
  },
];

const connectivity = [
  {
    number: "01",
    title: "Strategic Location",
    text: "Positioned to connect residents with important destinations across the city.",
  },
  {
    number: "02",
    title: "Everyday Convenience",
    text: "Essential services, retail and social infrastructure are within practical reach.",
  },
  {
    number: "03",
    title: "Connected Living",
    text: "Designed for a lifestyle where home remains connected to the city's opportunities.",
  },
];

const Location = () => {
  return (
    <main className="location-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="location-hero">
        <div className="location-hero-image">
          <img
            src="/images/hero/hero-desktop.jpg"
            alt="Vasavi Bhuvi location"
          />
        </div>

        <div className="location-hero-overlay" />

        <div className="location-hero-content">
          <span className="location-eyebrow">VASAVI BHUVI</span>

          <h1>
            Connected
            <br />
            <em>by location.</em>
          </h1>

          <p>
            A thoughtfully positioned address that keeps everyday essentials,
            important destinations and the city's opportunities within reach.
          </p>
        </div>

        <div className="location-hero-bottom">
          <span>DISCOVER THE LOCATION</span>
          <ArrowDown size={17} />
        </div>
      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="location-intro">
        <div className="location-container">
          <div className="location-section-label">
            <span>01</span>
            <span>THE ADDRESS</span>
          </div>

          <div className="location-intro-grid">
            <div>
              <span className="location-small-label">WHERE LIFE CONNECTS</span>

              <h2>
                An address
                <br />
                <em>with purpose.</em>
              </h2>
            </div>

            <div className="location-intro-copy">
              <p className="location-lead">
                Great homes are shaped not only by what surrounds them, but by
                how effortlessly they connect you to everyday life.
              </p>

              <p>
                Vasavi Bhuvi is envisioned as a connected residential address,
                bringing together convenience, accessibility and a considered
                urban lifestyle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAP SECTION
      ===================================================== */}

      <section className="location-map-section">
        <div className="location-container">
          <div className="location-map-header">
            <div>
              <div className="location-section-label">
                <span>02</span>
                <span>LOCATION MAP</span>
              </div>

              <h2>
                Find your way
                <br />
                <em>home.</em>
              </h2>
            </div>

            <p>
              Use the map to explore the project address and its surrounding
              neighbourhood.
            </p>
          </div>

          <div className="location-map-card">
            <div className="location-map-placeholder">
              <MapPin className="location-map-pin" size={42} />

              <span className="location-map-title">VASAVI BHUVI</span>

              <span className="location-map-subtitle">PROJECT LOCATION</span>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Maisammaguda%20Rd%2C%20Maisamma%20Gudem%2C%20Bhadurpalle%2C%20Hyderabad%2C%20Telangana%20500043"
                target="_blank"
                rel="noreferrer"
                className="location-map-button"
              >
                Open in Maps
                <Navigation size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          NEARBY
      ===================================================== */}

      <section className="location-nearby">
        <div className="location-container">
          <div className="location-nearby-header">
            <div>
              <div className="location-section-label">
                <span>03</span>
                <span>WHAT'S NEARBY</span>
              </div>

              <h2>
                Everything
                <br />
                <em>within reach.</em>
              </h2>
            </div>

            <p>
              From everyday essentials to education, healthcare and recreation,
              explore the categories that matter to everyday living.
            </p>
          </div>

          <div className="location-highlights-grid">
            {locationHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <article className="location-highlight-card" key={item.title}>
                  <div className="location-highlight-icon">
                    <Icon size={21} />
                  </div>

                  <span className="location-card-number">
                    {String(locationHighlights.indexOf(item) + 1).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <h3>{item.title}</h3>

                  <p>{item.text}</p>

                  <ArrowUpRight className="location-card-arrow" size={18} />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          CONNECTIVITY
      ===================================================== */}

      <section className="location-connectivity">
        <div className="location-container">
          <div className="location-connectivity-grid">
            <div className="location-connectivity-intro">
              <span className="location-small-label">CONNECTIVITY</span>

              <h2>
                Designed around
                <br />
                <em>your everyday.</em>
              </h2>

              <p>
                The value of an address extends beyond its boundaries. It is
                about the ease with which work, education, leisure and daily
                necessities become part of your routine.
              </p>
            </div>

            <div className="location-connectivity-list">
              {connectivity.map((item) => (
                <div className="location-connectivity-item" key={item.number}>
                  <span>{item.number}</span>

                  <div>
                    <h3>{item.title}</h3>

                    <p>{item.text}</p>
                  </div>

                  <ArrowUpRight size={19} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          LOCATION IMAGE
      ===================================================== */}

      <section className="location-visual">
        <div className="location-visual-image">
          <img
            src="/images/location/location-connectivity.jpg"
            alt="Connectivity around Vasavi Bhuvi"
            loading="lazy"
          />
        </div>

        <div className="location-visual-overlay" />

        <div className="location-visual-content">
          <span className="location-small-label">THE NEIGHBOURHOOD</span>

          <h2>
            Close to what
            <br />
            <em>matters.</em>
          </h2>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="location-cta">
        <div className="location-container">
          <div className="location-cta-card">
            <div>
              <span className="location-small-label">PLAN YOUR VISIT</span>

              <h2>
                Come experience
                <br />
                <em>the address.</em>
              </h2>

              <p>
                Contact our team to arrange a project visit and learn more about
                Vasavi Bhuvi.
              </p>
            </div>

            <a href="/contact" className="location-cta-button">
              Enquire Now
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Location;
