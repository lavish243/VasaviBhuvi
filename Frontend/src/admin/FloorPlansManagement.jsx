import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import "./FloorPlansManagement.css";

const emptyForm = {
  type: "2 BHK",
  facing: "East",
  title: "",
  areaSqFt: "",
  imagePath: "",
  features: "",
};

const getTokenConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("vasavi_admin_token")}`,
  },
});

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.title ||
  error.message ||
  "Something went wrong.";

const FloorPlansManagement = () => {
  const [floorPlans, setFloorPlans] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadFloorPlans = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get(
        "/admin/floor-plans",
        getTokenConfig(),
      );

      const data = response.data;
      setFloorPlans(Array.isArray(data) ? data : (data?.items ?? []));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFloorPlans();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setMessage("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const startEdit = (plan) => {
    let features = [];

    try {
      const parsed = JSON.parse(plan.featuresJson ?? "[]");
      features = Array.isArray(parsed) ? parsed : [];
    } catch {
      features = [];
    }

    setEditingId(plan.id);
    setForm({
      type: plan.type ?? "",
      facing: plan.facing ?? "",
      title: plan.title ?? "",
      areaSqFt: plan.areaSqFt ?? "",
      imagePath: plan.imagePath ?? "",
      features: features.join("\n"),
    });
    setImageFile(null);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadImage = async () => {
    if (!imageFile) return form.imagePath;

    const data = new FormData();
    data.append("file", imageFile);

    const response = await apiClient.post(
      "/admin/uploads/image",
      data,
      getTokenConfig(),
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
        "Image uploaded, but the API response did not contain an image path. Check the upload endpoint response.",
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
        type: form.type.trim(),
        facing: form.facing.trim(),
        title: form.title.trim(),
        areaSqFt: Number(form.areaSqFt),
        imagePath: imagePath || null,
        featuresJson: JSON.stringify(
          form.features
            .split("\n")
            .map((feature) => feature.trim())
            .filter(Boolean),
        ),
      };

      if (editingId !== null) {
        await apiClient.put(
          `/admin/floor-plans/${editingId}`,
          payload,
          getTokenConfig(),
        );
        setMessage("Floor plan updated successfully.");
      } else {
        await apiClient.post("/admin/floor-plans", payload, getTokenConfig());
        setMessage("Floor plan added successfully.");
      }

      resetForm();
      setMessage(
        editingId !== null
          ? "Floor plan updated successfully."
          : "Floor plan added successfully.",
      );
      await loadFloorPlans();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (plan) => {
    if (!window.confirm(`Delete "${plan.title}"? This cannot be undone.`)) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await apiClient.delete(`/admin/floor-plans/${plan.id}`, getTokenConfig());
      setMessage("Floor plan deleted successfully.");
      await loadFloorPlans();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="fp-admin">
      <header className="fp-admin-header">
        <div>
          <span>VASAVI BHUVI · ADMIN</span>
          <h1>Floor Plans Management</h1>
          <p>Add, update, and manage apartment floor plans.</p>
        </div>

        <button
          type="button"
          className="fp-secondary-btn"
          onClick={() => (window.location.href = "/admin")}
        >
          ← Dashboard
        </button>
      </header>

      <main className="fp-admin-main">
        {error && <div className="fp-alert fp-alert-error">{error}</div>}
        {message && <div className="fp-alert fp-alert-success">{message}</div>}

        <section className="fp-form-card">
          <div className="fp-card-heading">
            <div>
              <span className="fp-kicker">
                {editingId !== null ? "UPDATE DETAILS" : "NEW FLOOR PLAN"}
              </span>
              <h2>
                {editingId !== null ? "Edit Floor Plan" : "Add Floor Plan"}
              </h2>
            </div>
            {editingId !== null && (
              <button type="button" className="fp-text-btn" onClick={resetForm}>
                Cancel editing
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="fp-form-grid">
              <label>
                Floor Plan Type *
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                >
                  <option>2 BHK</option>
                  <option>2.5 BHK</option>
                  <option>3 BHK</option>
                </select>
              </label>

              <label>
                Facing *
                <select
                  name="facing"
                  value={form.facing}
                  onChange={handleChange}
                  required
                >
                  <option>East</option>
                  <option>West</option>
                  <option>North</option>
                  <option>South</option>
                  <option>North-East</option>
                  <option>North-West</option>
                  <option>South-East</option>
                  <option>South-West</option>
                </select>
              </label>

              <label className="fp-full-width">
                Title *
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Spacious 2 BHK East Facing"
                  maxLength={200}
                  required
                />
              </label>

              <label>
                Area (Sq. Ft.) *
                <input
                  type="number"
                  name="areaSqFt"
                  value={form.areaSqFt}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  required
                />
              </label>

              <label>
                Floor Plan Image
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
                    : form.imagePath || "Choose an image to upload"}
                </small>
              </label>

              <label className="fp-full-width">
                Features (one feature per line)
                <textarea
                  name="features"
                  value={form.features}
                  onChange={handleChange}
                  rows={4}
                  placeholder={"2 Bedrooms\n2 Bathrooms\nBalcony"}
                />
              </label>
            </div>

            <div className="fp-form-actions">
              <button
                className="fp-primary-btn"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                    ? "Update Floor Plan"
                    : "Add Floor Plan"}
              </button>

              <button
                className="fp-secondary-btn"
                type="button"
                onClick={resetForm}
              >
                Clear
              </button>
            </div>
          </form>
        </section>

        <section className="fp-list-section">
          <div className="fp-list-heading">
            <div>
              <span className="fp-kicker">PROJECT INVENTORY</span>
              <h2>Existing Floor Plans</h2>
            </div>
            <button
              className="fp-secondary-btn"
              type="button"
              onClick={loadFloorPlans}
              disabled={loading}
            >
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <p className="fp-empty">Loading floor plans...</p>
          ) : floorPlans.length === 0 ? (
            <p className="fp-empty">No floor plans found.</p>
          ) : (
            <div className="fp-table-wrap">
              <table className="fp-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Facing</th>
                    <th>Area</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {floorPlans.map((plan) => (
                    <tr key={plan.id}>
                      <td>
                        {plan.imagePath ? (
                          <img
                            className="fp-thumb"
                            src={
                              plan.imagePath.startsWith("http")
                                ? plan.imagePath
                                : `${apiClient.defaults.baseURL.replace(/\/api\/?$/, "")}${plan.imagePath.startsWith("/") ? "" : "/"}${plan.imagePath}`
                            }
                            alt={plan.title}
                          />
                        ) : (
                          <div className="fp-no-image">No image</div>
                        )}
                      </td>
                      <td>{plan.title}</td>
                      <td>{plan.type}</td>
                      <td>{plan.facing}</td>
                      <td>{plan.areaSqFt} Sq. Ft.</td>
                      <td>
                        <div className="fp-row-actions">
                          <button
                            type="button"
                            className="fp-edit-btn"
                            onClick={() => startEdit(plan)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="fp-delete-btn"
                            onClick={() => handleDelete(plan)}
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

export default FloorPlansManagement;
