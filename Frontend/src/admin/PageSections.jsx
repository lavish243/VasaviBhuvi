import { useCallback, useEffect, useState } from "react";
import {
  getAdminPageSections,
  createPageSection,
  updatePageSection,
  deletePageSection,
} from "../services/pageSectionService";
import "./PageSections.css";

const emptyForm = {
  sectionKey: "",
  title: "",
  subtitle: "",
  description: "",
  imagePath: "",
  secondaryImagePath: "",
  buttonText: "",
  buttonUrl: "",
  contentJson: "{}",
  sortOrder: 0,
  isPublished: true,
};

export default function PageSections() {
  const [sections, setSections] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("vasavi_admin_token");

  const loadSections = useCallback(async () => {
    if (!token) {
      setError("Please log in as an administrator first.");
      setLoading(false);
      return;
    }

    try {
      setError("");
      const data = await getAdminPageSections(token);
      setSections(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load page sections.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadSections();
  }, [loadSections]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : name === "sortOrder"
            ? Number(value)
            : value,
    }));
  };

  const openAddForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (section) => {
    setForm({
      sectionKey: section.sectionKey ?? "",
      title: section.title ?? "",
      subtitle: section.subtitle ?? "",
      description: section.description ?? "",
      imagePath: section.imagePath ?? "",
      secondaryImagePath: section.secondaryImagePath ?? "",
      buttonText: section.buttonText ?? "",
      buttonUrl: section.buttonUrl ?? "",
      contentJson: section.contentJson || "{}",
      sortOrder: section.sortOrder ?? 0,
      isPublished: section.isPublished ?? false,
    });

    setEditingId(section.id);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Your login session is missing. Please log in again.");
      return;
    }

    try {
      JSON.parse(form.contentJson || "{}");
    } catch {
      setError("Content JSON is invalid. Please correct it before saving.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        sectionKey: form.sectionKey.trim(),
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        description: form.description.trim(),
        imagePath: form.imagePath.trim() || null,
        secondaryImagePath: form.secondaryImagePath.trim() || null,
        buttonText: form.buttonText.trim() || null,
        buttonUrl: form.buttonUrl.trim() || null,
        contentJson: form.contentJson.trim() || "{}",
      };

      if (editingId) {
        await updatePageSection(editingId, payload, token);
        setSuccess("Section updated successfully.");
      } else {
        await createPageSection(payload, token);
        setSuccess("Section created successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });
      await loadSections();
    } catch (err) {
      setError(err.message || "Unable to save the section.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (section) => {
    const confirmed = window.confirm(
      `Delete the "${section.sectionKey}" section? This action cannot be undone.`,
    );

    if (!confirmed) return;

    if (!token) {
      setError("Your login session is missing. Please log in again.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deletePageSection(section.id, token);
      setSuccess(`Section "${section.sectionKey}" deleted successfully.`);
      await loadSections();
    } catch (err) {
      setError(err.message || "Unable to delete the section.");
    }
  };

  return (
    <main className="admin-page-sections">
      <div className="page-sections-header">
        <div>
          <h1>Website Page Sections</h1>
          <p>Manage the content displayed on the Vasavi Bhuvi website.</p>
        </div>

        <button
          type="button"
          className="page-sections-primary-btn"
          onClick={openAddForm}
        >
          + Add New Section
        </button>
      </div>

      {error && (
        <div className="page-sections-message error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="page-sections-message success" role="status">
          {success}
        </div>
      )}

      {showForm && (
        <section className="page-sections-form-card">
          <h2>{editingId ? "Edit Section" : "Add New Section"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="page-sections-form-grid">
              <label>
                Section Key *
                <input
                  name="sectionKey"
                  value={form.sectionKey}
                  onChange={handleChange}
                  placeholder="hero"
                  required
                  maxLength={150}
                />
              </label>

              <label>
                Title *
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Vasavi Bhuvi"
                  required
                  maxLength={250}
                />
              </label>

              <label>
                Subtitle
                <input
                  name="subtitle"
                  value={form.subtitle}
                  onChange={handleChange}
                  placeholder="Premium Residential Project"
                  maxLength={500}
                />
              </label>

              <label>
                Sort Order
                <input
                  name="sortOrder"
                  type="number"
                  value={form.sortOrder}
                  onChange={handleChange}
                  min="0"
                />
              </label>

              <label className="full-width">
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter section description"
                />
              </label>

              <label>
                Image Path
                <input
                  name="imagePath"
                  value={form.imagePath}
                  onChange={handleChange}
                  placeholder="/images/hero/hero-desktop.jpg"
                />
              </label>

              <label>
                Secondary Image Path
                <input
                  name="secondaryImagePath"
                  value={form.secondaryImagePath}
                  onChange={handleChange}
                  placeholder="/images/hero/hero-about.jpg"
                />
              </label>

              <label>
                Button Text
                <input
                  name="buttonText"
                  value={form.buttonText}
                  onChange={handleChange}
                  placeholder="Enquire Now"
                />
              </label>

              <label>
                Button URL
                <input
                  name="buttonUrl"
                  value={form.buttonUrl}
                  onChange={handleChange}
                  placeholder="/contact"
                />
              </label>

              <label className="full-width">
                Content JSON
                <textarea
                  name="contentJson"
                  value={form.contentJson}
                  onChange={handleChange}
                  rows="5"
                  placeholder='{"eyebrow":"Premium Residential Project"}'
                />
              </label>

              <label className="page-sections-checkbox full-width">
                <input
                  name="isPublished"
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={handleChange}
                />
                Published — visible to public API consumers
              </label>
            </div>

            <div className="page-sections-form-actions">
              <button
                type="submit"
                className="page-sections-primary-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Create Section"}
              </button>

              <button
                type="button"
                className="page-sections-secondary-btn"
                disabled={saving}
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm({ ...emptyForm });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="page-sections-table-card">
        {loading ? (
          <p>Loading sections...</p>
        ) : sections.length === 0 ? (
          <p>No sections found. Click “Add New Section” to get started.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Section Key</th>
                  <th>Title</th>
                  <th>Subtitle</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {sections.map((section) => (
                  <tr key={section.id}>
                    <td>{section.sectionKey}</td>
                    <td>{section.title || "-"}</td>
                    <td>{section.subtitle || "-"}</td>
                    <td>
                      <span
                        className={
                          section.isPublished
                            ? "page-sections-status published"
                            : "page-sections-status unpublished"
                        }
                      >
                        {section.isPublished ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      <div className="page-sections-row-actions">
                        <button
                          type="button"
                          className="page-sections-edit-btn"
                          onClick={() => openEditForm(section)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="page-sections-delete-btn"
                          onClick={() => handleDelete(section)}
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
  );
}
