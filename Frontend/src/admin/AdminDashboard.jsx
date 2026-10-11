import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("vasavi_admin_token");

        if (!token) {
          navigate("/admin/login", { replace: true });
          return;
        }

        const response = await apiClient.get("/Admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(response.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("vasavi_admin_token");
          localStorage.removeItem("vasavi_admin_user");
          navigate("/admin/login", { replace: true });
          return;
        }

        setError(
          err.response?.data?.message ||
            "Unable to load dashboard. Please check the API.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("vasavi_admin_token");
    localStorage.removeItem("vasavi_admin_user");
    navigate("/admin/login", { replace: true });
  };

  const sections = [
    {
      title: "Floor Plans",
      description: "Manage apartment layouts and areas.",
      path: "/admin/floor-plans",
    },
    {
      title: "Amenities",
      description: "Manage project facilities.",
      path: "/admin/amenities",
    },
    {
      title: "Gallery",
      description: "Manage project images.",
      path: "/admin/gallery",
    },
    {
      title: "Specifications",
      description: "Manage project specifications.",
      path: "/admin/specifications",
    },
    {
      title: "Project Details",
      description: "Manage main project information.",
      path: "/admin/project",
    },
    {
      title: "Enquiries",
      description: "View customer enquiries and contact details.",
      path: "/admin/enquiries",
    },
  ];

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">VASAVI BHUVI</span>
          <h1>Admin Dashboard</h1>
        </div>

        <button className="admin-logout" onClick={logout}>
          Logout
        </button>
      </header>

      <main className="admin-main">
        <h2>Project Overview</h2>
        <p className="admin-subtitle">
          Manage your website content from one place.
        </p>

        {loading && <p>Loading dashboard...</p>}

        {error && (
          <div className="admin-error" role="alert">
            {error}
          </div>
        )}

        {stats && (
          <div className="admin-stats">
            {Object.entries(stats).map(([key, value]) => (
              <div className="admin-stat-card" key={key}>
                <span>{key.replace(/([A-Z])/g, " $1")}</span>
                <strong>
                  {typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value ?? 0)}
                </strong>
              </div>
            ))}
          </div>
        )}

        <h2 className="admin-section-heading">Content Management</h2>

        <div className="admin-section-grid">
          {sections.map((section) => (
            <article className="admin-section-card" key={section.path}>
              <h3>{section.title}</h3>
              <p>{section.description}</p>
              <button
                onClick={() => navigate(section.path)}
                className="admin-manage-button"
              >
                Manage Content →
              </button>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
