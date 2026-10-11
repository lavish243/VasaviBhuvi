import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import "./SpecificationsManagement.css";

const emptyForm = {
  category: "",
  name: "",
  description: "",
};

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("vasavi_admin_token")}`,
  },
});

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.title ||
  error.message ||
  "Something went wrong.";

const SpecificationsManagement = () => {
  const navigate = useNavigate();

  const [specifications, setSpecifications] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadSpecifications = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get(
        "/admin/specifications",
        getAuthConfig(),
      );

      const data = response.data;

      setSpecifications(Array.isArray(data) ? data : (data?.items ?? []));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpecifications();
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
  };

  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      category: item.category ?? "",
      name: item.name ?? "",
      description: item.description ?? "",
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        category: form.category.trim(),
        name: form.name.trim(),
        description: form.description.trim(),
      };

      const wasEditing = editingId !== null;

      if (wasEditing) {
        await apiClient.put(
          `/admin/specifications/${editingId}`,
          payload,
          getAuthConfig(),
        );
      } else {
        await apiClient.post("/admin/specifications", payload, getAuthConfig());
      }

      resetForm();

      setMessage(
        wasEditing
          ? "Specification updated successfully."
          : "Specification added successfully.",
      );

      await loadSpecifications();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`,
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await apiClient.delete(
        `/admin/specifications/${item.id}`,
        getAuthConfig(),
      );

      if (editingId === item.id) {
        resetForm();
      }

      setMessage("Specification deleted successfully.");

      await loadSpecifications();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="spec-admin">
      <header className="spec-admin-header">
        <div>
          <span>VASAVI BHUVI · ADMIN</span>
          <h1>Specifications Management</h1>
          <p>Manage project specifications and descriptions.</p>
        </div>

        <button
          type="button"
          className="spec-secondary-btn"
          onClick={() => navigate("/admin")}
        >
          ← Dashboard
        </button>
      </header>

      <main className="spec-admin-main">
        {error && (
          <div className="spec-alert spec-alert-error" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="spec-alert spec-alert-success" role="status">
            {message}
          </div>
        )}

        <section className="spec-panel">
          <div className="spec-section-heading">
            <div>
              <span className="spec-kicker">
                {editingId !== null ? "EDIT DETAILS" : "NEW SPECIFICATION"}
              </span>

              <h2>
                {editingId !== null
                  ? "Edit Specification"
                  : "Add Specification"}
              </h2>
            </div>

            {editingId !== null && (
              <button
                type="button"
                className="spec-text-btn"
                onClick={resetForm}
              >
                Cancel editing
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="spec-form-grid">
              <label>
                Category *
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Structure"
                  maxLength={150}
                  required
                />
              </label>

              <label>
                Specification Name *
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Flooring"
                  maxLength={200}
                  required
                />
              </label>

              <label className="spec-full-width">
                Description *
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter the specification details..."
                  rows={5}
                  maxLength={4000}
                  required
                />
              </label>
            </div>

            <div className="spec-form-actions">
              <button
                type="submit"
                className="spec-primary-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                    ? "Update Specification"
                    : "Add Specification"}
              </button>

              <button
                type="button"
                className="spec-secondary-btn"
                onClick={resetForm}
              >
                Clear
              </button>
            </div>
          </form>
        </section>

        <section className="spec-panel">
          <div className="spec-section-heading">
            <div>
              <span className="spec-kicker">PROJECT DETAILS</span>
              <h2>All Specifications ({specifications.length})</h2>
            </div>

            <button
              type="button"
              className="spec-secondary-btn"
              onClick={loadSpecifications}
              disabled={loading}
            >
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <p className="spec-empty">Loading specifications...</p>
          ) : specifications.length === 0 ? (
            <p className="spec-empty">
              No specifications found. Add your first specification above.
            </p>
          ) : (
            <div className="spec-table-wrapper">
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {specifications.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span className="spec-category-tag">
                          {item.category}
                        </span>
                      </td>

                      <td className="spec-name-cell">{item.name}</td>

                      <td className="spec-description-cell">
                        {item.description}
                      </td>

                      <td>
                        <div className="spec-row-actions">
                          <button
                            type="button"
                            className="spec-edit-btn"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="spec-delete-btn"
                            onClick={() => handleDelete(item)}
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

export default SpecificationsManagement;
