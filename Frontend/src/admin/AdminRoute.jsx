import { Navigate, Outlet } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useEffect, useState } from "react";

const AdminRoute = () => {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;

    const verifyAdmin = async () => {
      const token = localStorage.getItem("vasavi_admin_token");

      if (!token) {
        if (!cancelled) setStatus("denied");
        return;
      }

      try {
        const response = await apiClient.get("/Auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const roles = Array.isArray(response.data.roles)
          ? response.data.roles
          : Array.isArray(response.data.Roles)
            ? response.data.Roles
            : [];

        const isAdmin = roles.some((role) => role.toLowerCase() === "admin");

        if (!isAdmin) {
          localStorage.removeItem("vasavi_admin_token");
          localStorage.removeItem("vasavi_admin_user");
        }

        if (!cancelled) setStatus(isAdmin ? "allowed" : "denied");
      } catch {
        localStorage.removeItem("vasavi_admin_token");
        localStorage.removeItem("vasavi_admin_user");

        if (!cancelled) setStatus("denied");
      }
    };

    verifyAdmin();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "checking") {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Verifying administrator access...
      </div>
    );
  }

  if (status === "denied") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
