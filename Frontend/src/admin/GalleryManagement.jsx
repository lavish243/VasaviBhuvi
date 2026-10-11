import { resolveImageUrl } from "../api/apiClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import "./GalleryManagement.css";

const emptyForm = {
  title: "",
  category: "Exterior",
  imagePath: "",
  altText: "",
};

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("vasavi_admin_token")}`,
  },
});

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.title ||
  error.message ||
  "Something went wrong.";

const GalleryManagement = () => {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadImages = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get(
        "/admin/gallery",
        authConfig()
      );

      const data = response.data;
      setImages(Array.isArray(data) ? data : data?.items ?? []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title ?? "",
      category: item.category ?? "Exterior",
      imagePath: item.imagePath ?? "",
      altText: item.altText ?? "",
    });
    setImageFile(null);
    setError("");
    setMessage("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadImage = async () => {
    if (!imageFile) return form.imagePath;

    const data = new FormData();
    data.append("file", imageFile);

    const response = await apiClient.post(
      "/admin/uploads/image",
      data,
      authConfig()
    );

    const result = response.data;

    const path =
      typeof result === "string"
        ? result
        : result?.imagePath ??
          result?.filePath ??
          result?.url ??
          result?.path;

    if (!path) {
      throw new Error(
        "The upload response did not contain an image path. Check your API upload response."
      );
    }

    return path;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const imagePath = await uploadImage();

      if (!imagePath) {
        throw new Error("Please select a gallery image.");
      }

      const payload = {
        title: form.title.trim(),
        category: form.category.trim(),
        imagePath,
        altText: form.altText.trim() || null,
      };

      const wasEditing = editingId !== null;

      if (wasEditing) {
        await apiClient.put(
          `/admin/gallery/${editingId}`,
          payload,
          authConfig()
        );
      } else {
        await apiClient.post(
          "/admin/gallery",
          payload,
          authConfig()
        );
      }

      resetForm();
      setMessage(
        wasEditing
          ? "Gallery image updated successfully."
          : "Gallery image added successfully."
      );

      await loadImages();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete gallery image "${item.title}"?`)) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await apiClient.delete(
        `/admin/gallery/${item.id}`,
        authConfig()
      );

      setMessage("Gallery image deleted successfully.");
      await loadImages();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const getImageUrl = (path) => resolveImageUrl(path);

  return (
    <div className="gallery-admin">
      <header className="gallery-admin-header">
        <div>
          <span>VASAVI BHUVI · ADMIN</span>
          <h1>Gallery Management</h1>
          <p>Manage project photos and gallery categories.</p>
        </div>

        <button
          type="button"
          className="gallery-secondary-btn"
          onClick={() => navigate("/admin")}
        >
          ← Dashboard
        </button>
      </header>

      <main className="gallery-admin-main">
        {error && (
          <div className="gallery-alert gallery-alert-error" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="gallery-alert gallery-alert-success" role="status">
            {message}
          </div>
        )}

        <section className="gallery-form-card">
          <div className="gallery-section-heading">
            <div>
              <span className="gallery-kicker">
                {editingId !== null ? "UPDATE IMAGE" : "ADD NEW IMAGE"}
              </span>
              <h2>
                {editingId !== null ? "Edit Gallery Image" : "Add Gallery Image"}
              </h2>
            </div>

            {editingId !== null && (
              <button
                type="button"
                className="gallery-text-btn"
                onClick={resetForm}
              >
                Cancel editing
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="gallery-form-grid">
              <label>
                Image Title *
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Luxury Swimming Pool"
                  maxLength={200}
                  required
                />
              </label>

              <label>
                Category *
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="Exterior">Exterior</option>
                  <option value="Interior">Interior</option>
                  <option value="Amenities">Amenities</option>
                  <option value="Floor Plans">Floor Plans</option>
                  <option value="Construction">Construction</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="gallery-full-width">
                Select Image {!form.imagePath && "*"}
                <input
                  type="file"
                  accept="image/*"
                  required={!form.imagePath && editingId === null}
                  onChange={(event) =>
                    setImageFile(event.target.files?.[0] ?? null)
                  }
                />
                <small>
                  {imageFile
                    ? imageFile.name
                    : form.imagePath || "Choose an image"}
                </small>
              </label>

              <label className="gallery-full-width">
                Alternative Text
                <input
                  name="altText"
                  value={form.altText}
                  onChange={handleChange}
                  placeholder="Describe the image for accessibility"
                  maxLength={300}
                />
              </label>

              {(imageFile || form.imagePath) && (
                <div className="gallery-preview gallery-full-width">
                  <p>Image Preview</p>
                  <img
                    src={
                      imageFile
                        ? URL.createObjectURL(imageFile)
                        : getImageUrl(form.imagePath)
                    }
                    alt={form.altText || form.title || "Gallery preview"}
                  />
                </div>
              )}
            </div>

            <div className="gallery-form-actions">
              <button
                type="submit"
                className="gallery-primary-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                    ? "Update Image"
                    : "Add Image"}
              </button>

              <button
                type="button"
                className="gallery-secondary-btn"
                onClick={resetForm}
              >
                Clear
              </button>
            </div>
          </form>
        </section>

        <section className="gallery-list-card">
          <div className="gallery-section-heading">
            <div>
              <span className="gallery-kicker">PROJECT PHOTOS</span>
              <h2>Gallery Images ({images.length})</h2>
            </div>

            <button
              type="button"
              className="gallery-secondary-btn"
              onClick={loadImages}
              disabled={loading}
            >
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <p className="gallery-empty">Loading gallery...</p>
          ) : images.length === 0 ? (
            <p className="gallery-empty">No gallery images found.</p>
          ) : (
            <div className="gallery-admin-grid">
              {images.map((item) => (
                <article className="gallery-admin-card" key={item.id}>
                  {item.imagePath ? (
                    <img
                      className="gallery-admin-image"
                      src={getImageUrl(item.imagePath)}
                      alt={item.altText || item.title}
                    />
                  ) : (
                    <div className="gallery-admin-no-image">
                      No image available
                    </div>
                  )}

                  <div className="gallery-admin-card-body">
                    <span className="gallery-category">
                      {item.category}
                    </span>
                    <h3>{item.title}</h3>

                    {item.altText && <p>{item.altText}</p>}

                    <div className="gallery-card-actions">
                      <button
                        type="button"
                        className="gallery-edit-btn"
                        onClick={() => startEdit(item)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="gallery-delete-btn"
                        onClick={() => handleDelete(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default GalleryManagement;