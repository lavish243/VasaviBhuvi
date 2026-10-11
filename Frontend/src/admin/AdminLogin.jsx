import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import apiClient from "../api/apiClient";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/Auth/login", {
        email: email.trim(),
        password,
      });

      const data = response.data;

      // Supports common token response property names.
      const token =
        typeof data === "string"
          ? data
          : data?.accessToken || data?.token || data?.jwt || data?.bearerToken;

      if (!token) {
        throw new Error(
          "The API did not return a recognized JWT token. Check the login response.",
        );
      }

      // Verify the account and its role using the backend.
      const meResponse = await apiClient.get("/Auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = meResponse.data;
      const roles = Array.isArray(user.roles)
        ? user.roles
        : Array.isArray(user.Roles)
          ? user.Roles
          : [];

      if (!roles.some((role) => role.toLowerCase() === "admin")) {
        setError("Access denied. This account is not an administrator.");
        return;
      }

      localStorage.setItem("vasavi_admin_token", token);
      localStorage.setItem("vasavi_admin_user", JSON.stringify(user));

      navigate("/admin", { replace: true });
    } catch (err) {
      console.error("Admin login failed:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.title ||
          err.message ||
          "Login failed. Please check your credentials and API.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <Link to="/" className="admin-login-brand">
          <span className="admin-login-brand-icon">
            <LockKeyhole size={23} />
          </span>
          <span>
            <strong>VASAVI BHUVI</strong>
            <small>ADMINISTRATION</small>
          </span>
        </Link>

        <div className="admin-login-heading">
          <span className="admin-login-eyebrow">SECURE ACCESS</span>
          <h1>Welcome back</h1>
          <p>Sign in to manage your project website.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field">
            <label htmlFor="admin-email">Email address</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              placeholder="admin@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="admin-password">Password</label>

            <div className="admin-password-wrapper">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-login-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in to dashboard"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link to="/">← Back to website</Link>
          <p>Authorized administrators only</p>
        </div>
      </div>
    </main>
  );
};

export default AdminLogin;
