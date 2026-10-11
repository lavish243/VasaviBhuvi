import { resolveImageUrl } from "../../api/apiClient";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { Link } from "react-router-dom";

import {
  galleryCategories as localCategories,
  galleryImages as localImages,
} from "../../data/gallery";

import { getGalleryImages } from "../../api/contentService";
import "./Gallery.css";

const API_ORIGIN = (
  import.meta.env.VITE_API_BASE_URL || "https://localhost:58389/api"
).replace(/\/api\/?$/, "");

const getImageUrl = (path) => resolveImageUrl(path);

const normalizeImage = (item, index) => ({
  id: item.id ?? index + 1,
  title: item.title ?? item.Title ?? "Vasavi Bhuvi",
  category: item.category ?? item.Category ?? "Architecture",
  image: getImageUrl(
    item.imagePath ?? item.ImagePath ?? item.image ?? item.Image,
  ),
  altText: item.altText ?? item.AltText ?? item.title ?? "Vasavi Bhuvi",
});

const Gallery = () => {
  const [images, setImages] = useState(localImages);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadGallery = async () => {
      try {
        const data = await getGalleryImages();
        const records = Array.isArray(data) ? data : data?.items;

        if (isMounted && Array.isArray(records) && records.length > 0) {
          setImages(records.map(normalizeImage));
          setActiveIndex(0);
        } else if (isMounted && Array.isArray(records)) {
          setImages(localImages);
        }
      } catch (error) {
        console.error("Failed to load gallery from API:", error);

        if (isMounted) {
          setImages(localImages);
        }
      }
    };

    loadGallery();

    return () => {
      isMounted = false;
    };
  }, []);

  const galleryCategories = [
    "All",
    ...new Set(images.map((item) => item.category).filter(Boolean)),
  ];

  const filteredImages =
    activeCategory === "All"
      ? images
      : images.filter((item) => item.category === activeCategory);

  const safeIndex =
    filteredImages.length > 0
      ? Math.min(activeIndex, filteredImages.length - 1)
      : 0;

  const activeImage = filteredImages[safeIndex];

  const goNext = () => {
    if (!filteredImages.length) return;

    setActiveIndex((current) =>
      current >= filteredImages.length - 1 ? 0 : current + 1,
    );
  };

  const goPrevious = () => {
    if (!filteredImages.length) return;

    setActiveIndex((current) =>
      current <= 0 ? filteredImages.length - 1 : current - 1,
    );
  };

  const changeCategory = (category) => {
    setActiveCategory(category);
    setActiveIndex(0);
  };

  useEffect(() => {
    if (!isViewerOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsViewerOpen(false);
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrevious();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isViewerOpen, activeCategory, filteredImages.length]);

  return (
    <>
      <section className="gallery-section" id="gallery">
        <div className="gallery-container">
          <div className="gallery-header">
            <div>
              <span className="gallery-eyebrow">VISUAL JOURNEY</span>

              <h2>
                See life at
                <br />
                <span>Vasavi Bhuvi.</span>
              </h2>
            </div>

            <div className="gallery-header-right">
              <p>
                Explore the architecture, interiors, landscape and lifestyle
                spaces through the project gallery.
              </p>

              <Link to="/gallery" className="gallery-page-link">
                Open Gallery
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>

          <div className="gallery-filters">
            {galleryCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  activeCategory === category
                    ? "gallery-filter active"
                    : "gallery-filter"
                }
                onClick={() => changeCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {activeImage && (
            <div className="gallery-feature">
              <button
                type="button"
                className="gallery-main-image"
                onClick={() => setIsViewerOpen(true)}
                aria-label={`Open ${activeImage.title}`}
              >
                <img
                  src={activeImage.image}
                  alt={activeImage.altText || activeImage.title}
                />

                <div className="gallery-main-overlay">
                  <span>View Fullscreen</span>
                </div>
              </button>

              <div className="gallery-feature-info">
                <div>
                  <span className="gallery-feature-category">
                    {activeImage.category}
                  </span>

                  <h3>{activeImage.title}</h3>
                </div>

                <div className="gallery-navigation">
                  <span className="gallery-counter">
                    {String(safeIndex + 1).padStart(2, "0")}
                    <i>/</i>
                    {String(filteredImages.length).padStart(2, "0")}
                  </span>

                  <button
                    type="button"
                    onClick={goPrevious}
                    aria-label="Previous image"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next image"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {!activeImage && (
            <p className="gallery-empty">
              No gallery images are available in this category yet.
            </p>
          )}

          <div className="gallery-thumbnails">
            {filteredImages.map((image, index) => (
              <button
                type="button"
                key={image.id ?? index}
                className={
                  index === safeIndex
                    ? "gallery-thumbnail active"
                    : "gallery-thumbnail"
                }
                onClick={() => setActiveIndex(index)}
                aria-label={`View ${image.title}`}
              >
                <img
                  src={image.image}
                  alt={image.altText || image.title}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {isViewerOpen && activeImage && (
        <div
          className="gallery-viewer"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery viewer"
          onClick={() => setIsViewerOpen(false)}
        >
          <button
            type="button"
            className="gallery-viewer-close"
            onClick={() => setIsViewerOpen(false)}
            aria-label="Close gallery"
          >
            <X size={27} />
          </button>

          <button
            type="button"
            className="gallery-viewer-prev"
            onClick={(event) => {
              event.stopPropagation();
              goPrevious();
            }}
            aria-label="Previous image"
          >
            <ArrowLeft size={22} />
          </button>

          <div
            className="gallery-viewer-image"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={activeImage.image}
              alt={activeImage.altText || activeImage.title}
            />

            <div className="gallery-viewer-caption">
              <span>{activeImage.category}</span>
              <strong>{activeImage.title}</strong>
            </div>
          </div>

          <button
            type="button"
            className="gallery-viewer-next"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            aria-label="Next image"
          >
            <ArrowRight size={22} />
          </button>
        </div>
      )}
    </>
  );
};

export default Gallery;
