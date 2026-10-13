import { resolveImageUrl } from "../../api/apiClient";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { amenities as localAmenities } from "../../data/amenities";
import { getAmenities } from "../../api/contentService";
import "./Amenities.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://vasavi-bhuvi-api.onrender.com/api"
).replace(/\/+$/, "");

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/i, "");

const getImageUrl = (imagePath) => resolveImageUrl(imagePath);

const normalizeAmenity = (amenity, index) => ({
  id: amenity.id ?? index + 1,
  name: amenity.name ?? amenity.Name ?? "Amenity",
  category: amenity.category ?? amenity.Category ?? "Lifestyle",
  description: amenity.description ?? amenity.Description ?? "",
  image: getImageUrl(
    amenity.imagePath ?? amenity.ImagePath ?? amenity.image ?? amenity.Image,
  ),
});

const Amenities = () => {
  const [amenities, setAmenities] = useState(localAmenities);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAmenities = async () => {
      try {
        const data = await getAmenities();
        const records = Array.isArray(data) ? data : data?.items;

        if (isMounted && Array.isArray(records) && records.length > 0) {
          setAmenities(records.map(normalizeAmenity));
        } else if (isMounted && Array.isArray(records)) {
          // Keep local content visible if the database has no records yet.
          setAmenities(localAmenities);
        }
      } catch (error) {
        console.error("Failed to load amenities from API:", error);
        if (isMounted) setAmenities(localAmenities);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAmenities();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredAmenities = amenities.slice(0, 6);

  return (
    <section className="amenities-section">
      <div className="amenities-container">
        <div className="amenities-header">
          <div>
            <span className="amenities-eyebrow">LIFESTYLE & AMENITIES</span>

            <h2>
              Everything you need
              <br />
              <span>within reach.</span>
            </h2>
          </div>

          <div className="amenities-header-right">
            <p>
              Spaces designed to bring together wellness, recreation, relaxation
              and everyday convenience for residents of every age.
            </p>

            <Link to="/amenities" className="amenities-view-all">
              Explore All Amenities
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>

        {loading && amenities.length === 0 && <p>Loading amenities...</p>}

        <div className="amenities-grid">
          {featuredAmenities.map((amenity, index) => (
            <article
              className={`amenity-card ${
                index === 0 ? "amenity-card-large" : ""
              }`}
              key={amenity.id ?? index}
            >
              <div className="amenity-image">
                {amenity.image && (
                  <img src={amenity.image} alt={amenity.name} loading="lazy" />
                )}

                <div className="amenity-image-overlay" />

                <div className="amenity-icon">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <span className="amenity-category">{amenity.category}</span>
              </div>

              <div className="amenity-content">
                <h3>{amenity.name}</h3>

                <p>{amenity.description}</p>

                <Link to="/amenities" className="amenity-link">
                  Discover
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
