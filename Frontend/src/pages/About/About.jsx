import {
  ArrowDown,
  ArrowUpRight,
  Building2,
  Leaf,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import "./About.css";

const aboutHighlights = [
  {
    number: "01",
    title: "Thoughtful Architecture",
    text: "A considered approach to space, proportion, movement and everyday living.",
  },
  {
    number: "02",
    title: "Connected Living",
    text: "A residential environment designed around convenience, accessibility and community.",
  },
  {
    number: "03",
    title: "Lifestyle Amenities",
    text: "Spaces created to support relaxation, wellness, recreation and social connection.",
  },
  {
    number: "04",
    title: "Long-Term Value",
    text: "A development planned with quality, functionality and enduring appeal in mind.",
  },
];

const philosophyItems = [
  {
    icon: Building2,
    number: "01",
    title: "Architecture",
    text: "Clean forms, considered proportions and purposeful spaces create an environment that feels refined without becoming excessive.",
  },
  {
    icon: Leaf,
    number: "02",
    title: "Nature",
    text: "Landscape and open spaces are treated as an important part of the living experience rather than an afterthought.",
  },
  {
    icon: Sparkles,
    number: "03",
    title: "Lifestyle",
    text: "Amenities and shared spaces are planned around the way contemporary families live, connect and unwind.",
  },
  {
    icon: ShieldCheck,
    number: "04",
    title: "Quality",
    text: "Every element is approached with attention to usability, finish, comfort and the long-term residential experience.",
  },
];

const About = () => {
  return (
    <main className="about-page">
      {/* =========================================
          HERO
      ========================================= */}

      <section className="about-hero">
        <div className="about-hero-image">
          <img
            src="/images/hero/hero-about.jpg"
            alt="Vasavi Bhuvi residential project"
          />
        </div>

        <div className="about-hero-overlay" />

        <div className="about-hero-content">
          <span className="about-hero-eyebrow">ABOUT THE PROJECT</span>

          <h1>
            A place
            <br />
            <em>to belong.</em>
          </h1>

          <p>
            Discover the thought, architecture and lifestyle behind Vasavi
            Bhuvi.
          </p>
        </div>

        <div className="about-hero-bottom">
          <span>SCROLL TO EXPLORE</span>

          <ArrowDown size={18} />
        </div>
      </section>

      {/* =========================================
          PROJECT STORY
      ========================================= */}

      <section className="about-story">
        <div className="about-container">
          <div className="about-section-label">
            <span>01</span>
            <span>THE STORY</span>
          </div>

          <div className="about-story-grid">
            <div className="about-story-heading">
              <span className="about-small-label">THE VASAVI BHUVI STORY</span>

              <h2>
                Designed around
                <br />
                <span>the way life unfolds.</span>
              </h2>
            </div>

            <div className="about-story-copy">
              <p className="about-lead">
                Vasavi Bhuvi is envisioned as more than a collection of
                residences. It is a considered environment where architecture,
                landscape, amenities and everyday life come together.
              </p>

              <p>
                From the arrival experience to the spaces where residents
                gather, relax and reconnect, every part of the development is
                intended to create a sense of belonging.
              </p>

              <p>
                The design approach balances contemporary architecture with
                warm, human-scale spaces, creating a residential experience that
                feels sophisticated while remaining comfortable and intuitive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          STORY IMAGE
      ========================================= */}

      <section className="about-story-image-section">
        <div className="about-story-image">
          <img
            src="/images/about/about-story.jpg"
            alt="Vasavi Bhuvi architecture"
            loading="lazy"
          />

          <div className="about-image-caption">
            <span>THE ARCHITECTURAL VISION</span>
            <strong>Spaces designed for everyday moments.</strong>
          </div>
        </div>
      </section>

      {/* =========================================
          DESIGN PHILOSOPHY
      ========================================= */}

      <section className="about-philosophy">
        <div className="about-container">
          <div className="about-section-label light">
            <span>02</span>
            <span>DESIGN PHILOSOPHY</span>
          </div>

          <div className="about-philosophy-heading">
            <span className="about-small-label light">OUR APPROACH</span>

            <h2>
              Thoughtful by
              <br />
              <span>design.</span>
            </h2>

            <p>
              Four principles shape the experience of Vasavi Bhuvi —
              architecture, nature, lifestyle and quality.
            </p>
          </div>

          <div className="about-philosophy-grid">
            {philosophyItems.map((item) => {
              const Icon = item.icon;

              return (
                <article className="about-philosophy-card" key={item.number}>
                  <div className="about-philosophy-card-top">
                    <span>{item.number}</span>

                    <Icon size={24} strokeWidth={1.4} />
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.text}</p>

                  <div className="about-card-line" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================
          ARCHITECTURE / LIFESTYLE
      ========================================= */}

      <section className="about-experience">
        <div className="about-container">
          <div className="about-section-label">
            <span>03</span>
            <span>THE EXPERIENCE</span>
          </div>

          <div className="about-experience-grid">
            <div className="about-experience-image">
              <img
                src="/images/about/about-lifestyle.jpg"
                alt="Vasavi Bhuvi lifestyle spaces"
                loading="lazy"
              />

              <div className="about-experience-number">03</div>
            </div>

            <div className="about-experience-content">
              <span className="about-small-label">LIVING WELL</span>

              <h2>
                More than
                <br />
                <span>a residence.</span>
              </h2>

              <p className="about-lead">
                The experience of a home extends beyond four walls.
              </p>

              <p>
                It lives in the morning light, the landscaped surroundings, the
                spaces where children play, the places where neighbours meet and
                the quiet moments at the end of the day.
              </p>

              <p>
                Vasavi Bhuvi brings these experiences together through a
                carefully considered combination of private residences, shared
                amenities and thoughtfully designed outdoor spaces.
              </p>

              <a href="/amenities" className="about-outline-button">
                Explore Amenities
                <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          HIGHLIGHTS
      ========================================= */}

      <section className="about-highlights">
        <div className="about-container">
          <div className="about-section-label">
            <span>04</span>
            <span>PROJECT HIGHLIGHTS</span>
          </div>

          <div className="about-highlights-heading">
            <span className="about-small-label">AT A GLANCE</span>

            <h2>
              The details that
              <br />
              <span>shape the experience.</span>
            </h2>
          </div>

          <div className="about-highlight-list">
            {aboutHighlights.map((item) => (
              <article className="about-highlight-row" key={item.number}>
                <span className="about-highlight-number">{item.number}</span>

                <h3>{item.title}</h3>

                <p>{item.text}</p>

                <ArrowUpRight className="about-highlight-arrow" size={20} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          STATEMENT
      ========================================= */}

      <section className="about-statement">
        <div className="about-statement-image">
          <img
            src="/images/about/about-statement.jpg"
            alt="Vasavi Bhuvi residential lifestyle"
            loading="lazy"
          />
        </div>

        <div className="about-statement-overlay" />

        <div className="about-statement-content">
          <span>THE VASAVI BHUVI VISION</span>

          <h2>
            A home should feel
            <br />
            <em>like it belongs to you.</em>
          </h2>
        </div>
      </section>

      {/* =========================================
          FINAL CTA
      ========================================= */}

      <section className="about-final-cta">
        <div className="about-container">
          <div>
            <span>DISCOVER VASAVI BHUVI</span>

            <h2>
              See the project
              <br />
              <span>for yourself.</span>
            </h2>
          </div>

          <a href="/contact" className="about-final-button">
            Enquire Now
            <ArrowUpRight size={19} />
          </a>
        </div>
      </section>
    </main>
  );
};

export default About;
