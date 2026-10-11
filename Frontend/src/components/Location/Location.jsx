import {
  ArrowUpRight,
  MapPin,
  Navigation,
  Train,
  Plane,
  School,
  Hospital,
  ShoppingBag,
} from "lucide-react";
import "./Location.css";

const connectivity = [
  {
    icon: Train,
    title: "MMTS Station Gundlapochampally",
    description: "1.5 Kms",
  },
  { icon: Navigation, title: "ORR", description: "2.5 Kms" },
  { icon: ShoppingBag, title: "NH7", description: "4 Kms" },
  {
    icon: Hospital,
    title: "Secunderabad Railway Station",
    description: "18 Kms",
  },
  { icon: Hospital, title: "Ram Hospital", description: "5 Km" },
  { icon: School, title: "St. Michaels School", description: "550 Mtrs" },
  {
    icon: School,
    title: "Suchitra Academy International School",
    description: "1.8 Kms",
  },
];

const Location = () => {
  return (
    <section className="location-section" id="location">
      <div className="location-container">
        {/* Header */}
        <div className="location-header">
          <div>
            <span className="location-eyebrow">
              <MapPin size={15} />
              LOCATION
            </span>

            <h2>
              Connected to
              <span> Everything That Matters.</span>
            </h2>
          </div>

          <p>
            Vasavi Bhuvi is connected to key roads, rail, hospitals, schools and
            employment destinations across Hyderabad.
          </p>
        </div>

        {/* Main Content */}
        <div className="location-main">
          {/* Map */}
          <div className="location-map-card">
            <div className="location-map">
              <iframe
                title="Vasavi Bhuvi Location"
                src="https://www.google.com/maps?output=embed&q=Vasavi+Bhuvi"
                width="100%"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />

              <div className="map-overlay">
                <div className="map-project-marker">
                  <MapPin size={18} />
                  <span>Vasavi Bhuvi</span>
                </div>
              </div>
            </div>

            <div className="map-footer">
              <div>
                <span className="map-footer-label">PROJECT LOCATION</span>

                <strong>Maisammaguda Road, Kompally, Hyderabad</strong>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Maisammaguda%20Rd%2C%20Maisamma%20Gudem%2C%20Bhadurpalle%2C%20Hyderabad%2C%20Telangana%20500043"
                target="_blank"
                rel="noreferrer"
                className="direction-button"
              >
                <Navigation size={16} />
                Get Directions
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>

          {/* Connectivity */}
          <div className="location-connectivity">
            <div className="connectivity-heading">
              <span>CONNECTED LIVING</span>
              <h3>Everything within reach.</h3>
            </div>

            <div className="connectivity-list">
              {connectivity.map((item) => {
                const Icon = item.icon;

                return (
                  <div className="connectivity-item" key={item.title}>
                    <div className="connectivity-icon">
                      <Icon size={21} strokeWidth={1.7} />
                    </div>

                    <div className="connectivity-content">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>

                    <ArrowUpRight className="connectivity-arrow" size={18} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="location-cta">
          <div>
            <span>DISCOVER THE NEIGHBOURHOOD</span>
            <h3>Experience the convenience of a well-connected address.</h3>
          </div>

          <a href="/location" className="location-cta-button">
            Explore Location
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Location;
