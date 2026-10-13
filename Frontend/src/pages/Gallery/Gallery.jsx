import { resolveImageUrl } from "../../api/apiClient";
import React, { useEffect, useState } from "react";

import {
  ArrowDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
} from "lucide-react";

import { getGalleryImages } from "../../api/contentService";
import "./Gallery.css";

// ------------------------------------------------------
// FALLBACK IMAGES
// These appear if the API is unavailable or returns no data.
// ------------------------------------------------------

const fallbackGalleryImages = [
  {
    id: 1,
    category: "Exterior",
    title: "The Architecture",
    image: "/images/gallery/exterior-01.jpg",
    size: "large",
  },
  {
    id: 2,
    category: "Exterior",
    title: "Building Facade",
    image: "/images/gallery/exterior-02.jpg",
    size: "small",
  },
  {
    id: 3,
    category: "Exterior",
    title: "Arrival Experience",
    image: "/images/gallery/exterior-03.jpg",
    size: "small",
  },
  {
    id: 4,
    category: "Exterior",
    title: "The Residence",
    image: "/images/gallery/exterior-04.jpg",
    size: "wide",
  },
  {
    id: 5,
    category: "Interiors",
    title: "Living Spaces",
    image: "/images/gallery/interior-01.jpg",
    size: "large",
  },
  {
    id: 6,
    category: "Interiors",
    title: "Contemporary Interiors",
    image: "/images/gallery/interior-02.jpg",
    size: "small",
  },
  {
    id: 7,
    category: "Interiors",
    title: "Private Spaces",
    image: "/images/gallery/interior-03.jpg",
    size: "small",
  },
  {
    id: 8,
    category: "Interiors",
    title: "A Refined Interior",
    image: "/images/gallery/interior-04.jpg",
    size: "wide",
  },
  {
    id: 9,
    category: "Amenities",
    title: "Lifestyle Amenities",
    image: "/images/gallery/amenities-01.jpg",
    size: "large",
  },
  {
    id: 10,
    category: "Amenities",
    title: "Recreation",
    image: "/images/gallery/amenities-02.jpg",
    size: "small",
  },
  {
    id: 11,
    category: "Amenities",
    title: "Wellness",
    image: "/images/gallery/amenities-03.jpg",
    size: "small",
  },
  {
    id: 12,
    category: "Amenities",
    title: "Community Spaces",
    image: "/images/gallery/amenities-04.jpg",
    size: "wide",
  },
  {
    id: 13,
    category: "Lifestyle",
    title: "Everyday Moments",
    image: "/images/gallery/lifestyle-01.jpg",
    size: "large",
  },
  {
    id: 14,
    category: "Lifestyle",
    title: "Life at Vasavi Bhuvi",
    image: "/images/gallery/lifestyle-02.jpg",
    size: "small",
  },
];

// ------------------------------------------------------
// HELPERS
// ------------------------------------------------------

const getApiOrigin = () => {
  const apiBase =
    import.meta.env.VITE_API_BASE_URL ||
    "https://vasavi-bhuvi-api.onrender.com/api";

  return apiBase.replace(/\/api\/?$/i, "").replace(/\/+$/, "");
};

const getImageUrl = (path) => resolveImageUrl(path);

const normalizeCategory = (category) => {
  const value = String(category || "Other")
    .trim()
    .toLowerCase();

  if (value === "interior" || value === "interiors") {
    return "Interiors";
  }

  if (value === "floor plan" || value === "floor plans") {
    return "Floor Plans";
  }

  if (value === "construction") {
    return "Construction";
  }

  if (value === "lifestyle") {
    return "Lifestyle";
  }

  if (value === "amenity" || value === "amenities") {
    return "Amenities";
  }

  if (value === "exterior" || value === "exteriors") {
    return "Exterior";
  }

  return "Other";
};

// ------------------------------------------------------
// GALLERY COMPONENT
// ------------------------------------------------------

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  const [galleryImages, setGalleryImages] = useState(fallbackGalleryImages);

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // ----------------------------------------------------
  // LOAD IMAGES FROM BACKEND
  // GET /api/Content/gallery
  // ----------------------------------------------------

  useEffect(() => {
    let isMounted = true;

    const loadGalleryImages = async () => {
      setLoading(true);
      setApiError("");

      try {
        const response = await getGalleryImages();

        // Supports either:
        // [ { id, title, category, imagePath } ]
        // or { items: [ ... ] }
        // or { data: [ ... ] }

        const data = Array.isArray(response)
          ? response
          : Array.isArray(response?.items)
            ? response.items
            : Array.isArray(response?.data)
              ? response.data
              : [];

        if (!isMounted) {
          return;
        }

        // Keep fallback images if the API returns no records.
        if (data.length === 0) {
          setGalleryImages(fallbackGalleryImages);
          return;
        }

        const normalizedImages = data
          .map((item, index) => {
            const rawPath =
              item.imagePath ??
              item.ImagePath ??
              item.imageUrl ??
              item.ImageUrl ??
              item.filePath ??
              item.FilePath ??
              item.url ??
              item.Url ??
              item.image ??
              item.Image ??
              "";

            const title =
              item.title ??
              item.Title ??
              item.altText ??
              item.AltText ??
              `Gallery Image ${index + 1}`;

            const category = normalizeCategory(item.category ?? item.Category);

            const imageUrl = getImageUrl(rawPath);

            return {
              id: item.id ?? item.Id ?? `gallery-${index + 1}`,
              title,
              category,
              image: imageUrl,
              size:
                index % 4 === 0 ? "large" : index % 4 === 3 ? "wide" : "small",
            };
          })
          .filter((item) => item.image);

        if (isMounted) {
          if (normalizedImages.length > 0) {
            setGalleryImages(normalizedImages);
          } else {
            setGalleryImages(fallbackGalleryImages);
          }
        }
      } catch (error) {
        console.error("Failed to load gallery images from API:", error);

        if (isMounted) {
          setApiError(
            "Unable to load the latest gallery images. Showing default images.",
          );
          setGalleryImages(fallbackGalleryImages);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadGalleryImages();

    return () => {
      isMounted = false;
    };
  }, []);

  // ----------------------------------------------------
  // CATEGORY FILTERS
  // ----------------------------------------------------

  const categories = [
    "All",
    "Exterior",
    "Interiors",
    "Amenities",
    "Lifestyle",
    "Floor Plans",
    "Construction",
    "Other",
  ];

  const filteredImages =
    activeCategory === "All"
      ? galleryImages
      : galleryImages.filter((item) => item.category === activeCategory);

  // ----------------------------------------------------
  // LIGHTBOX NAVIGATION
  // ----------------------------------------------------

  const selectedIndex = selectedImage
    ? filteredImages.findIndex(
        (item) => String(item.id) === String(selectedImage.id),
      )
    : -1;

  const showPrevious = () => {
    if (filteredImages.length === 0) {
      return;
    }

    const currentIndex = selectedIndex < 0 ? 0 : selectedIndex;

    const previousIndex =
      currentIndex <= 0 ? filteredImages.length - 1 : currentIndex - 1;

    setSelectedImage(filteredImages[previousIndex]);
  };

  const showNext = () => {
    if (filteredImages.length === 0) {
      return;
    }

    const currentIndex = selectedIndex < 0 ? 0 : selectedIndex;

    const nextIndex =
      currentIndex >= filteredImages.length - 1 ? 0 : currentIndex + 1;

    setSelectedImage(filteredImages[nextIndex]);
  };

  // ----------------------------------------------------
  // KEYBOARD CONTROLS
  // Escape = close
  // Left arrow = previous image
  // Right arrow = next image
  // ----------------------------------------------------

  useEffect(() => {
    if (!selectedImage) {
      return undefined;
    }

    const handleKeyboard = (event) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [selectedImage, selectedIndex, filteredImages]);

  // ----------------------------------------------------
  // PREVENT BACKGROUND SCROLL WHEN LIGHTBOX IS OPEN
  // ----------------------------------------------------

  useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  // ----------------------------------------------------
  // RENDER
  // ----------------------------------------------------

  return (
    <main className="gallery-page">
      {/* HERO */}

      <section className="gallery-hero">
        <div className="gallery-hero-image">
          <img src="/images/hero/hero-desktop.jpg" alt="Vasavi Bhuvi gallery" />
        </div>

        <div className="gallery-hero-overlay" />

        <div className="gallery-hero-content">
          <span className="gallery-eyebrow">VASAVI BHUVI</span>

          <h1>
            See the
            <br />
            <em>possibility.</em>
          </h1>

          <p>
            Explore the architecture, interiors, amenities and lifestyle
            envisioned for Vasavi Bhuvi.
          </p>
        </div>

        <div className="gallery-hero-bottom">
          <span>EXPLORE GALLERY</span>
          <ArrowDown size={18} />
        </div>
      </section>

      {/* INTRO */}

      <section className="gallery-intro">
        <div className="gallery-container">
          <div className="gallery-section-label">
            <span>01</span>
            <span>PROJECT GALLERY</span>
          </div>

          <div className="gallery-intro-grid">
            <div>
              <span className="gallery-small-label">A VISUAL JOURNEY</span>

              <h2>
                Spaces made
                <br />
                <em>to be lived.</em>
              </h2>
            </div>

            <div className="gallery-intro-copy">
              <p className="gallery-lead">
                Take a closer look at the spaces, details and experiences that
                define the project.
              </p>

              <p>
                From architectural expressions to intimate interiors and
                lifestyle amenities, discover the character of Vasavi Bhuvi
                through images.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY AND FILTERS */}

      <section className="gallery-content">
        <div className="gallery-container">
          <div className="gallery-toolbar">
            <div className="gallery-section-label">
              <span>02</span>
              <span>EXPLORE</span>
            </div>

            <div className="gallery-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={activeCategory === category ? "active" : ""}
                  onClick={() => {
                    setActiveCategory(category);
                    setSelectedImage(null);
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <p className="gallery-loading">Loading gallery images...</p>
          )}

          {apiError && (
            <p className="gallery-loading" role="status">
              {apiError}
            </p>
          )}

          {/* IMAGE GRID */}

          <div className="gallery-grid">
            {filteredImages.map((item, index) => (
              <article
                key={item.id}
                className={`gallery-item gallery-item-${item.size}`}
                onClick={() => setSelectedImage(item)}
              >
                <div className="gallery-item-image">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    onError={(event) => {
                      // Avoid repeated errors if a URL is invalid.
                      event.currentTarget.onerror = null;
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />

                  <div className="gallery-item-overlay">
                    <div className="gallery-item-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="gallery-item-expand">
                      <Maximize2 size={18} />
                    </div>
                  </div>
                </div>

                <div className="gallery-item-info">
                  <span>{item.category}</span>
                  <h3>{item.title}</h3>
                </div>
              </article>
            ))}
          </div>

          {!loading && filteredImages.length === 0 && (
            <div className="gallery-empty">
              No images available in this category.
            </div>
          )}
        </div>
      </section>

      {/* VISUAL STATEMENT */}

      <section className="gallery-statement">
        <div className="gallery-statement-image">
          <img
            src="/images/gallery/lifestyle-01.jpg"
            alt="Life at Vasavi Bhuvi"
            loading="lazy"
          />
        </div>

        <div className="gallery-statement-content">
          <span className="gallery-small-label">THE EXPERIENCE</span>

          <h2>
            More than
            <br />
            <em>a residence.</em>
          </h2>

          <p>
            A thoughtfully created environment where architecture, landscape,
            amenities and everyday life come together.
          </p>

          <a href="/amenities" className="gallery-statement-link">
            Explore Amenities
            <ArrowUpRight size={17} />
          </a>
        </div>
      </section>

      {/* CALL TO ACTION */}

      <section className="gallery-cta">
        <div className="gallery-container">
          <div className="gallery-cta-content">
            <span className="gallery-small-label">DISCOVER VASAVI BHUVI</span>

            <h2>
              Imagine your
              <br />
              <em>life here.</em>
            </h2>

            <p>
              Speak with our team to learn more about residences, plans,
              amenities and availability.
            </p>

            <a href="/contact" className="gallery-cta-button">
              Enquire Now
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}

      {selectedImage && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            className="gallery-lightbox-close"
            onClick={() => setSelectedImage(null)}
            aria-label="Close image"
          >
            <X size={24} />
          </button>

          <button
            type="button"
            className="gallery-lightbox-prev"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={26} />
          </button>

          <div
            className="gallery-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={selectedImage.image} alt={selectedImage.title} />

            <div className="gallery-lightbox-caption">
              <div>
                <span>{selectedImage.category}</span>
                <h3>{selectedImage.title}</h3>
              </div>

              <span className="gallery-lightbox-counter">
                {String(Math.max(selectedIndex + 1, 1)).padStart(2, "0")}
                {" / "}
                {String(filteredImages.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="gallery-lightbox-next"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Next image"
          >
            <ChevronRight size={26} />
          </button>
        </div>
      )}
    </main>
  );
};

export default Gallery;
