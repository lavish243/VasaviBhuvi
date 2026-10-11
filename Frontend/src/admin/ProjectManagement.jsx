import { resolveImageUrl } from "../api/apiClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import "./ProjectManagement.css";

const emptyForm = {
  name: "",
  tagline: "",
  description: "",
  address: "",
  reraNumber: "",
  heroImagePath: "",
  brochurePath: "",
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

const ProjectManagement = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [heroFile, setHeroFile] = useState(null);
  const [brochureFile, setBrochureFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getImageUrl = (path) => resolveImageUrl(path);

  const loadProject = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get("/admin/project", getAuthConfig());

      const project = response.data;

      setForm({
        name: project.name ?? "",
        tagline: project.tagline ?? "",
        description: project.description ?? "",
        address: project.address ?? "",
        reraNumber: project.reraNumber ?? "",
        heroImagePath: project.heroImagePath ?? "",
        brochurePath: project.brochurePath ?? "",
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const uploadFile = async (file, type) => {
    if (!file) return null;

    const data = new FormData();
    data.append("file", file);

    const response = await apiClient.post(
      `/admin/uploads/${type}`,
      data,
      getAuthConfig(),
    );

    const result = response.data;

    const path =
      typeof result === "string"
        ? result
        : (result?.filePath ??
          result?.imagePath ??
          result?.brochurePath ??
          result?.url ??
          result?.path);

    if (!path) {
      throw new Error(
        `The ${type} upload response did not contain a file path.`,
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
      const uploadedHero = await uploadFile(heroFile, "image");
      const uploadedBrochure = await uploadFile(brochureFile, "document");

      const payload = {
        name: form.name.trim(),
        tagline: form.tagline.trim(),
        description: form.description.trim(),
        address: form.address.trim(),
        reraNumber: form.reraNumber.trim() || null,
        heroImagePath: uploadedHero ?? (form.heroImagePath || null),
        brochurePath: uploadedBrochure ?? (form.brochurePath || null),
      };

      await apiClient.put("/admin/project", payload, getAuthConfig());

      setForm(payload);
      setHeroFile(null);
      setBrochureFile(null);
      setMessage("Project details updated successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="project-admin-loading">Loading project details...</div>
    );
  }

  return (
    <div className="project-admin">
      <header className="project-admin-header">
        <div>
          <span>VASAVI BHUVI · ADMIN</span>
          <h1>Project Details</h1>
          <p>Manage the main information displayed on your website.</p>
        </div>

        <button
          type="button"
          className="project-secondary-btn"
          onClick={() => navigate("/admin")}
        >
          ← Dashboard
        </button>
      </header>

      <main className="project-admin-main">
        {error && (
          <div className="project-alert project-alert-error" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="project-alert project-alert-success" role="status">
            {message}
          </div>
        )}

        <section className="project-panel">
          <div className="project-section-heading">
            <span className="project-kicker">GENERAL INFORMATION</span>
            <h2>Edit Project Content</h2>
            <p>Changes are saved to your backend database.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="project-form-grid">
              <label>
                Project Name *
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  maxLength={200}
                  required
                />
              </label>

              <label>
                Tagline
                <input
                  name="tagline"
                  value={form.tagline}
                  onChange={handleChange}
                  maxLength={500}
                  placeholder="A thoughtfully designed address for modern living"
                />
              </label>

              <label className="project-full-width">
                Description *
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  required
                />
              </label>

              <label className="project-full-width">
                Project Address *
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </label>

              <label className="project-full-width">
                RERA Number
                <input
                  name="reraNumber"
                  value={form.reraNumber}
                  onChange={handleChange}
                  maxLength={150}
                  placeholder="Enter the registered RERA number"
                />
              </label>

              <label className="project-full-width">
                Hero Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setHeroFile(event.target.files?.[0] ?? null)
                  }
                />
                <small>
                  {heroFile?.name ||
                    form.heroImagePath ||
                    "No hero image uploaded"}
                </small>
              </label>

              {(heroFile || form.heroImagePath) && (
                <div className="project-file-preview project-full-width">
                  <img
                    src={
                      heroFile
                        ? URL.createObjectURL(heroFile)
                        : getImageUrl(form.heroImagePath)
                    }
                    alt="Project hero preview"
                  />
                </div>
              )}

              <label className="project-full-width">
                Brochure (PDF or document)
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(event) =>
                    setBrochureFile(event.target.files?.[0] ?? null)
                  }
                />
                <small>
                  {brochureFile?.name ||
                    form.brochurePath ||
                    "No brochure uploaded"}
                </small>
              </label>
            </div>

            <div className="project-form-actions">
              <button
                type="submit"
                className="project-primary-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Project Details"}
              </button>

              <button
                type="button"
                className="project-secondary-btn"
                onClick={loadProject}
                disabled={saving}
              >
                Reload
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ProjectManagement;
