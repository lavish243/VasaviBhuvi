import { resolveImageUrl } from "../api/apiClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import "./AmenitiesManagement.css";

const emptyForm = {
  name: "",
  category: "",
  description: "",
  imagePath: "",
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

const AmenitiesManagement = () => {
  const navigate = useNavigate();

  const [amenities, setAmenities] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadAmenities = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get("/admin/amenities", authConfig());

      const data = response.data;
      setAmenities(Array.isArray(data) ? data : (data?.items ?? []));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAmenities();
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

  const startEdit = (amenity) => {
    setEditingId(amenity.id);
    setForm({
      name: amenity.name ?? "",
      category: amenity.category ?? "",
      description: amenity.description ?? "",
      imagePath: amenity.imagePath ?? "",
    });
    setImageFile(null);
    setError("");
    setMessage("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadImage = async () => {
    if (!imageFile) return form.imagePath || null;

    const data = new FormData();
    data.append("file", imageFile);

    const response = await apiClient.post(
      "/admin/uploads/image",
      data,
      authConfig(),
    );

    const result = response.data;

    const path =
      typeof result === "string"
        ? result
        : (result?.imagePath ??
          result?.filePath ??
          result?.url ??
          result?.path);

    if (!path) {
      throw new Error(
        "Image upload response did not contain an image path. Check the upload endpoint response.",
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

      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        imagePath: imagePath || null,
      };

      const wasEditing = editingId !== null;

      if (wasEditing) {
        await apiClient.put(
          `/admin/amenities/${editingId}`,
          payload,
          authConfig(),
        );
      } else {
        await apiClient.post("/admin/amenities", payload, authConfig());
      }

      resetForm();
      setMessage(
        wasEditing
          ? "Amenity updated successfully."
          : "Amenity added successfully.",
      );

      await loadAmenities();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (amenity) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${amenity.name}"?`,
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await apiClient.delete(`/admin/amenities/${amenity.id}`, authConfig());

      setMessage("Amenity deleted successfully.");
      await loadAmenities();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const getImageUrl = (path) => resolveImageUrl(path);

  return (
    <div className="amenity-admin">
      <header className="amenity-admin-header">
        <div>
          <span>VASAVI BHUVI · ADMIN</span>
          <h1>Amenities Management</h1>
          <p>Manage project amenities and facilities.</p>
        </div>

        <button
          type="button"
          className="amenity-secondary-btn"
          onClick={() => navigate("/admin")}
        >
          ← Dashboard
        </button>
      </header>

      <main className="amenity-admin-main">
        {error && (
          <div className="amenity-alert amenity-alert-error" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="amenity-alert amenity-alert-success" role="status">
            {message}
          </div>
        )}

        <section className="amenity-form-card">
          <div className="amenity-section-heading">
            <div>
              <span className="amenity-kicker">
                {editingId !== null ? "UPDATE AMENITY" : "ADD NEW AMENITY"}
              </span>
              <h2>{editingId !== null ? "Edit Amenity" : "Add Amenity"}</h2>
            </div>

            {editingId !== null && (
              <button
                type="button"
                className="amenity-text-btn"
                onClick={resetForm}
              >
                Cancel editing
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="amenity-form-grid">
              <label>
                Amenity Name *
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Swimming Pool"
                  maxLength={200}
                  required
                />
              </label>

              <label>
                Category *
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Sports & Recreation"
                  maxLength={100}
                  required
                />
              </label>

              <label className="amenity-full-width">
                Description *
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this amenity..."
                  rows={4}
                  required
                />
              </label>

              <label className="amenity-full-width">
                Amenity Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setImageFile(event.target.files?.[0] ?? null)
                  }
                />
                <small>
                  {imageFile
                    ? imageFile.name
                    : form.imagePath || "Optional: select an image"}
                </small>
              </label>

              {(imageFile || form.imagePath) && (
                <div className="amenity-preview amenity-full-width">
                  <img
                    src={
                      imageFile
                        ? URL.createObjectURL(imageFile)
                        : getImageUrl(form.imagePath)
                    }
                    alt="Amenity preview"
                  />
                </div>
              )}
            </div>

            <div className="amenity-form-actions">
              <button
                type="submit"
                className="amenity-primary-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                    ? "Update Amenity"
                    : "Add Amenity"}
              </button>

              <button
                type="button"
                className="amenity-secondary-btn"
                onClick={resetForm}
              >
                Clear
              </button>
            </div>
          </form>
        </section>

        <section className="amenity-list-card">
          <div className="amenity-section-heading">
            <div>
              <span className="amenity-kicker">PROJECT FACILITIES</span>
              <h2>Existing Amenities ({amenities.length})</h2>
            </div>

            <button
              type="button"
              className="amenity-secondary-btn"
              onClick={loadAmenities}
              disabled={loading}
            >
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <p className="amenity-empty">Loading amenities...</p>
          ) : amenities.length === 0 ? (
            <p className="amenity-empty">No amenities found.</p>
          ) : (
            <div className="amenity-table-wrap">
              <table className="amenity-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {amenities.map((amenity) => (
                    <tr key={amenity.id}>
                      <td>
                        {amenity.imagePath ? (
                          <img
                            className="amenity-thumb"
                            src={getImageUrl(amenity.imagePath)}
                            alt={amenity.name}
                          />
                        ) : (
                          <div className="amenity-no-image">No image</div>
                        )}
                      </td>

                      <td>{amenity.name}</td>
                      <td>{amenity.category}</td>
                      <td className="amenity-description-cell">
                        {amenity.description}
                      </td>

                      <td>
                        <div className="amenity-row-actions">
                          <button
                            type="button"
                            className="amenity-edit-btn"
                            onClick={() => startEdit(amenity)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="amenity-delete-btn"
                            onClick={() => handleDelete(amenity)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AmenitiesManagement;
