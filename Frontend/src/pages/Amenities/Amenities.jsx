import { resolveImageUrl } from "../../api/apiClient";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Dumbbell,
  Waves,
  Trees,
  Baby,
  Gamepad2,
  Users,
  ShieldCheck,
  Sparkles,
  Flower2,
  Building2,
  LoaderCircle,
  ImageOff,
} from "lucide-react";

import { getAmenities } from "../../api/contentService";
import apiClient from "../../api/apiClient";
import "./Amenities.css";

const DEFAULT_IMAGE = "/images/amenities/amenities-lifestyle.jpg";

const iconForCategory = (category = "") => {
  const value = category.toLowerCase();

  if (/garden|landscape|nature|green/.test(value)) return Trees;
  if (/fitness|gym|sport|wellness/.test(value)) return Dumbbell;
  if (/pool|water|swim|leisure|recreation/.test(value)) return Waves;
  if (/child|kid|family|play/.test(value)) return Baby;
  if (/community|social|clubhouse/.test(value)) return Users;
  if (/safety|security|convenience/.test(value)) return ShieldCheck;
  if (/flower|relax/.test(value)) return Flower2;
  if (/game|indoor/.test(value)) return Gamepad2;
  if (/luxury|premium/.test(value)) return Sparkles;

  return Building2;
};

const getImageUrl = (path) => resolveImageUrl(path);

const getResponseItems = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.amenities)) return response.amenities;

  return [];
};

const Amenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadAmenities = async () => {
      try {
        setLoading(true);
        setError("");

        // Public endpoint: no admin token required.
        const response = await getAmenities();
        const records = getResponseItems(response);

        if (cancelled) return;

        const mapped = records.map((item, index) => ({
          id: item.id ?? item.Id ?? `amenity-${index}`,
          name: item.name ?? item.Name ?? "Amenity",
          category: item.category ?? item.Category ?? "Lifestyle",
          description: item.description ?? item.Description ?? "",
          imagePath: item.imagePath ?? item.ImagePath ?? "",
          image: getImageUrl(item.imagePath ?? item.ImagePath ?? ""),
        }));

        setAmenities(mapped);
      } catch (err) {
        console.error("Failed to load public amenities:", err);

        if (!cancelled) {
          setError(
            "Amenities could not be loaded. Please check the API connection.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAmenities();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = [
      ...new Set(amenities.map((item) => item.category.trim()).filter(Boolean)),
    ];

    return unique;
  }, [amenities]);

  return (
    <main className="amenities-page">
      {/* HERO */}
      <section className="amenities-hero">
        <div className="amenities-hero-image">
          <img src={DEFAULT_IMAGE} alt="Vasavi Bhuvi lifestyle amenities" />
        </div>

        <div className="amenities-hero-overlay" />

        <div className="amenities-hero-content">
          <span className="amenities-eyebrow">VASAVI BHUVI</span>

          <h1>
            More than
            <br />
            <em>amenities.</em>
          </h1>

          <p>
            Discover the facilities and spaces designed to make everyday living
            more comfortable, active and connected.
          </p>
        </div>

        <div className="amenities-hero-bottom">
          <span>EXPLORE THE EXPERIENCE</span>
          <ArrowDown size={16} />
        </div>
      </section>

      {/* INTRO */}
      <section className="amenities-intro">
        <div className="amenities-container">
          <div className="amenities-section-label">
            <span>01</span>
            <span>THE EXPERIENCE</span>
          </div>

          <div className="amenities-intro-grid">
            <div className="amenities-intro-heading">
              <span className="amenities-small-label">DESIGNED FOR LIFE</span>

              <h2>
                Everything you need.
                <br />
                <em>Nothing you don't.</em>
              </h2>
            </div>

            <div className="amenities-intro-copy">
              <p className="amenities-lead">
                A home becomes more meaningful when the spaces around it are
                designed with equal care.
              </p>

              <p>
                Explore the amenities currently published for Vasavi Bhuvi. Each
                card is loaded from the project content API and reflects the
                information saved through the Admin panel.
              </p>

              <a href="#amenity-collection" className="amenities-text-link">
                Explore amenities <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE IMAGE */}
      <section className="amenities-feature">
        <div className="amenities-container">
          <div className="amenities-feature-grid">
            <div className="amenities-feature-image">
              <img
                src={DEFAULT_IMAGE}
                alt="Lifestyle amenities at Vasavi Bhuvi"
                loading="lazy"
              />

              <div className="amenities-image-caption">
                <span>THE AMENITY EXPERIENCE</span>
                <span>VASAVI BHUVI</span>
              </div>
            </div>

            <div className="amenities-feature-content">
              <span className="amenities-small-label">
                A COMPLETE LIFESTYLE
              </span>

              <h2>
                Spaces that
                <br />
                <em>bring life together.</em>
              </h2>

              <p>
                Explore the facilities available in the project. Images, names
                and descriptions are managed through the Admin panel.
              </p>

              <div className="amenities-feature-stat">
                <strong>{amenities.length}</strong>
                <span>
                  {amenities.length === 1
                    ? "Published amenity"
                    : "Published amenities"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC AMENITY COLLECTION */}
      <section className="amenities-collection" id="amenity-collection">
        <div className="amenities-container">
          <div className="amenities-collection-header">
            <div>
              <div className="amenities-section-label">
                <span>02</span>
                <span>AMENITY COLLECTION</span>
              </div>

              <h2>
                Created for
                <br />
                <em>every kind of day.</em>
              </h2>
            </div>

            <p>
              Browse the latest facilities published by the Vasavi Bhuvi
              administration.
            </p>
          </div>

          {loading && (
            <div className="amenities-status" role="status">
              <LoaderCircle size={22} />
              <span>Loading amenities...</span>
            </div>
          )}

          {!loading && error && (
            <div className="amenities-status amenities-status-error">
              <p>{error}</p>
              <button type="button" onClick={() => window.location.reload()}>
                Try again
              </button>
            </div>
          )}

          {!loading && !error && amenities.length === 0 && (
            <div className="amenities-status">
              <p>No amenities have been published yet.</p>
            </div>
          )}

          {!loading && !error && amenities.length > 0 && (
            <>
              {categories.length > 0 && (
                <div className="amenities-category-labels">
                  {categories.map((category) => (
                    <a
                      href={`#category-${encodeURIComponent(category)}`}
                      key={category}
                    >
                      {category}
                    </a>
                  ))}
                </div>
              )}

              {categories.map((category, categoryIndex) => {
                const categoryAmenities = amenities.filter(
                  (item) => item.category === category,
                );

                return (
                  <div
                    className="amenities-dynamic-category"
                    id={`category-${encodeURIComponent(category)}`}
                    key={category}
                  >
                    <div className="amenities-dynamic-category-heading">
                      <span>{String(categoryIndex + 1).padStart(2, "0")}</span>
                      <h3>{category}</h3>
                      <span>
                        {categoryAmenities.length}{" "}
                        {categoryAmenities.length === 1
                          ? "amenity"
                          : "amenities"}
                      </span>
                    </div>

                    <div className="amenities-category-grid">
                      {categoryAmenities.map((amenity, index) => {
                        const Icon = iconForCategory(amenity.category);

                        return (
                          <article
                            className="amenity-category-card amenities-dynamic-card"
                            key={amenity.id}
                          >
                            <div className="amenity-dynamic-image">
                              {amenity.image ? (
                                <img
                                  src={amenity.image}
                                  alt={amenity.name}
                                  loading="lazy"
                                  onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                    event.currentTarget.parentElement.classList.add(
                                      "amenity-image-missing",
                                    );
                                  }}
                                />
                              ) : (
                                <div className="amenity-image-placeholder">
                                  <ImageOff size={28} />
                                  <span>Image unavailable</span>
                                </div>
                              )}

                              <span className="amenity-image-number">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                            </div>

                            <div className="amenity-card-top">
                              <div className="amenity-card-icon">
                                <Icon size={21} />
                              </div>

                              <span className="amenity-card-number">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                            </div>

                            <h3>{amenity.name}</h3>

                            <p>
                              {amenity.description ||
                                "Discover this facility at Vasavi Bhuvi."}
                            </p>

                            <span className="amenity-dynamic-category-name">
                              {amenity.category}
                            </span>

                            <ArrowUpRight
                              className="amenity-card-arrow"
                              size={18}
                            />
                          </article>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </section>

      {/* LIFESTYLE */}
      <section className="amenities-lifestyle">
        <div className="amenities-lifestyle-image">
          <img
            src={DEFAULT_IMAGE}
            alt="Vasavi Bhuvi lifestyle"
            loading="lazy"
          />
        </div>

        <div className="amenities-lifestyle-content">
          <span className="amenities-small-label">BEYOND THE BASICS</span>

          <h2>
            A lifestyle
            <br />
            <em>in balance.</em>
          </h2>

          <p>
            Explore amenities for recreation, wellness, nature and community
            through the collection above.
          </p>

          <div className="amenities-lifestyle-list">
            {[
              {
                title: "Move",
                text: "Fitness and active spaces.",
                icon: Dumbbell,
              },
              {
                title: "Relax",
                text: "Spaces to unwind.",
                icon: Flower2,
              },
              {
                title: "Connect",
                text: "Community and shared spaces.",
                icon: Users,
              },
              {
                title: "Play",
                text: "Recreation for everyday living.",
                icon: Gamepad2,
              },
            ].map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div className="amenities-lifestyle-item" key={feature.title}>
                  <span className="amenities-lifestyle-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="amenities-lifestyle-icon">
                    <Icon size={17} />
                  </div>

                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </div>

                  <ArrowUpRight size={17} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DYNAMIC IMAGE GALLERY */}
      <section className="amenities-gallery">
        <div className="amenities-container">
          <div className="amenities-gallery-heading">
            <div className="amenities-section-label">
              <span>03</span>
              <span>THE DETAILS</span>
            </div>

            <h2>
              Discover the
              <br />
              <em>amenity collection.</em>
            </h2>
          </div>

          {!loading && amenities.some((item) => item.image) ? (
            <div className="amenities-gallery-grid">
              {amenities
                .filter((item) => item.image)
                .slice(0, 3)
                .map((amenity, index) => (
                  <div
                    className={
                      index === 0
                        ? "amenities-gallery-large"
                        : "amenities-gallery-small"
                    }
                    key={amenity.id}
                  >
                    <img
                      src={amenity.image}
                      alt={amenity.name}
                      loading="lazy"
                    />
                    <span>{amenity.name}</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="amenities-gallery-empty">
              Uploaded amenity images will appear here when available.
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="amenities-cta">
        <div className="amenities-container">
          <div className="amenities-cta-card">
            <div>
              <span className="amenities-small-label">
                EXPERIENCE VASAVI BHUVI
              </span>

              <h2>
                See the spaces
                <br />
                <em>for yourself.</em>
              </h2>

              <p>
                Explore the project and discover the facilities designed for
                everyday living.
              </p>
            </div>

            <a href="/contact" className="amenities-cta-button">
              Enquire Now <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Amenities;
