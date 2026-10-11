import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import "./EnquiriesManagement.css";

const STATUSES = ["New", "Contacted", "Interested", "Closed"];

const getValue = (item, camelCase, pascalCase) =>
  item?.[camelCase] ?? item?.[pascalCase] ?? "";

const getId = (item) => String(getValue(item, "id", "Id"));

const getStatus = (item) => String(getValue(item, "status", "Status") || "New");

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getErrorMessage = (err, fallback) => {
  if (err.response?.status === 401) {
    return "Your session has expired. Please log in again.";
  }

  if (err.response?.status === 403) {
    return "You do not have permission to perform this action.";
  }

  return err.response?.data?.message || fallback;
};

const EnquiriesManagement = () => {
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("vasavi_admin_token");

    if (!token) {
      navigate("/admin/login", { replace: true });
      throw new Error("Please log in as an administrator.");
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const handleUnauthorized = (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem("vasavi_admin_token");
      localStorage.removeItem("vasavi_admin_user");
      navigate("/admin/login", { replace: true });
      return true;
    }

    return false;
  };

  const loadEnquiries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("vasavi_admin_token");

      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }

      const response = await apiClient.get("/enquiries/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
          ? data.items
          : [];

      setEnquiries(items);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        setError(
          err.response?.data?.message ||
            "Unable to load enquiries. Check that the API is running.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  const filteredEnquiries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return enquiries.filter((item) => {
      const name = String(getValue(item, "name", "Name"));
      const phone = String(getValue(item, "phone", "Phone"));
      const email = String(getValue(item, "email", "Email"));

      const matchesSearch = [name, phone, email].some((value) =>
        value.toLowerCase().includes(query),
      );

      const matchesStatus =
        statusFilter === "All" ||
        getStatus(item).toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [enquiries, search, statusFilter]);

  const counts = useMemo(() => {
    const result = {
      All: enquiries.length,
      New: 0,
      Contacted: 0,
      Interested: 0,
      Closed: 0,
    };

    enquiries.forEach((item) => {
      const status = getStatus(item);

      const matchingStatus = STATUSES.find(
        (value) => value.toLowerCase() === status.toLowerCase(),
      );

      if (matchingStatus) {
        result[matchingStatus] += 1;
      }
    });

    return result;
  }, [enquiries]);

  const updateEnquiryStatus = async (item, newStatus) => {
    const id = getId(item);
    const oldStatus = getStatus(item);

    if (!id || newStatus === oldStatus) return;

    setActionMessage("");
    setActionError("");
    setUpdatingId(id);

    try {
      const headers = getAuthHeaders();

      await apiClient.put(
        `/enquiries/admin/${id}/status`,
        { status: newStatus },
        { headers },
      );

      setEnquiries((previous) =>
        previous.map((enquiry) =>
          getId(enquiry) === id
            ? { ...enquiry, status: newStatus, Status: newStatus }
            : enquiry,
        ),
      );

      setSelectedEnquiry((previous) =>
        previous && getId(previous) === id
          ? { ...previous, status: newStatus, Status: newStatus }
          : previous,
      );

      setActionMessage("Enquiry status updated successfully.");
    } catch (err) {
      if (!handleUnauthorized(err)) {
        setActionError(
          getErrorMessage(err, "Unable to update enquiry status."),
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteEnquiry = async (item) => {
    const id = getId(item);

    if (!id) {
      setActionError("Unable to identify this enquiry.");
      return;
    }

    const customerName = getValue(item, "name", "Name") || "this customer";

    if (
      !window.confirm(
        `Are you sure you want to permanently delete the enquiry from ${customerName}?`,
      )
    ) {
      return;
    }

    setActionMessage("");
    setActionError("");
    setDeletingId(id);

    try {
      const headers = getAuthHeaders();

      await apiClient.delete(`/enquiries/admin/${id}`, { headers });

      setEnquiries((previous) =>
        previous.filter((enquiry) => getId(enquiry) !== id),
      );

      setSelectedEnquiry((previous) =>
        previous && getId(previous) === id ? null : previous,
      );

      setActionMessage("Enquiry deleted successfully.");
    } catch (err) {
      if (!handleUnauthorized(err)) {
        setActionError(getErrorMessage(err, "Unable to delete enquiry."));
      }
    } finally {
      setDeletingId(null);
    }
  };

  const clearMessages = () => {
    setActionMessage("");
    setActionError("");
  };

  return (
    <div className="enquiries-admin">
      <header className="enquiries-admin-header">
        <div>
          <span className="enquiries-eyebrow">VASAVI BHUVI · ADMIN</span>
          <h1>Enquiries Management</h1>
          <p>View customer enquiries and manage follow-up status.</p>
        </div>

        <div className="enquiries-header-actions">
          <button
            type="button"
            className="enquiries-refresh-btn"
            onClick={loadEnquiries}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>

          <Link to="/admin" className="enquiries-back-btn">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <section className="enquiries-stat-grid">
        {["All", ...STATUSES].map((status) => (
          <button
            type="button"
            key={status}
            className={`enquiries-stat-card ${
              statusFilter === status ? "active" : ""
            }`}
            onClick={() => {
              clearMessages();
              setStatusFilter(status);
            }}
          >
            <span>{status === "All" ? "Total Enquiries" : status}</span>
            <strong>{counts[status]}</strong>
          </button>
        ))}
      </section>

      <section className="enquiries-panel">
        <div className="enquiries-toolbar">
          <div>
            <h2>Customer Enquiries</h2>
            <p>{filteredEnquiries.length} result(s) found</p>
          </div>

          <div className="enquiries-filters">
            <input
              type="search"
              placeholder="Search name, phone or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search enquiries"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {actionMessage && (
          <div className="enquiries-success" role="status">
            {actionMessage}
            <button
              type="button"
              onClick={() => setActionMessage("")}
              aria-label="Dismiss success message"
            >
              ×
            </button>
          </div>
        )}

        {actionError && (
          <div className="enquiries-error" role="alert">
            <span>{actionError}</span>
            <button type="button" onClick={() => setActionError("")}>
              Dismiss
            </button>
          </div>
        )}

        {error && (
          <div className="enquiries-error" role="alert">
            <span>{error}</span>
            <button type="button" onClick={loadEnquiries}>
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="enquiries-empty">Loading enquiries...</div>
        ) : !error && filteredEnquiries.length === 0 ? (
          <div className="enquiries-empty">
            <h3>No enquiries found</h3>
            <p>
              {enquiries.length === 0
                ? "Customer enquiries will appear here after a website visitor submits the form."
                : "Try changing your search text or status filter."}
            </p>
          </div>
        ) : (
          !error && (
            <div className="enquiries-table-wrapper">
              <table className="enquiries-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Configuration</th>
                    <th>Status</th>
                    <th>Received</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEnquiries.map((item) => {
                    const id = getId(item);
                    const name = getValue(item, "name", "Name") || "Unknown";
                    const phone = getValue(item, "phone", "Phone");
                    const email = getValue(item, "email", "Email");
                    const configuration = getValue(
                      item,
                      "configuration",
                      "Configuration",
                    );
                    const status = getStatus(item);
                    const createdAt = getValue(
                      item,
                      "createdAtUtc",
                      "CreatedAtUtc",
                    );

                    const isUpdating = updatingId === id;
                    const isDeleting = deletingId === id;

                    return (
                      <tr key={id}>
                        <td>
                          <div className="enquiries-customer">
                            <span className="enquiries-avatar">
                              {String(name).charAt(0).toUpperCase()}
                            </span>
                            <strong>{name}</strong>
                          </div>
                        </td>

                        <td>
                          <div className="enquiries-contact">
                            {phone ? (
                              <a href={`tel:${phone}`}>{phone}</a>
                            ) : null}
                            {email ? (
                              <a href={`mailto:${email}`}>{email}</a>
                            ) : null}
                            {!phone && !email && "—"}
                          </div>
                        </td>

                        <td>{configuration || "—"}</td>

                        <td>
                          <select
                            className={`enquiries-status-select status-${status
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")}`}
                            value={status}
                            disabled={isUpdating || isDeleting}
                            onChange={(event) =>
                              updateEnquiryStatus(item, event.target.value)
                            }
                            aria-label={`Update status for ${name}`}
                          >
                            {!STATUSES.includes(status) && (
                              <option value={status}>{status}</option>
                            )}

                            {STATUSES.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>

                          {isUpdating && (
                            <small className="enquiries-action-loading">
                              Saving...
                            </small>
                          )}
                        </td>

                        <td>{formatDate(createdAt)}</td>

                        <td>
                          <div className="enquiries-row-actions">
                            <button
                              type="button"
                              className="enquiries-view-btn"
                              disabled={isDeleting}
                              onClick={() => setSelectedEnquiry(item)}
                            >
                              View
                            </button>

                            <button
                              type="button"
                              className="enquiries-delete-btn"
                              disabled={isDeleting || isUpdating}
                              onClick={() => deleteEnquiry(item)}
                            >
                              {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </section>

      {selectedEnquiry && (
        <div
          className="enquiries-modal-backdrop"
          onClick={() => setSelectedEnquiry(null)}
        >
          <section
            className="enquiries-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="enquiries-modal-header">
              <div>
                <span className="enquiries-eyebrow">CUSTOMER DETAILS</span>
                <h2 id="enquiry-modal-title">Enquiry Information</h2>
              </div>

              <button
                type="button"
                className="enquiries-close-btn"
                onClick={() => setSelectedEnquiry(null)}
                aria-label="Close details"
              >
                ×
              </button>
            </div>

            <div className="enquiries-detail-grid">
              <div>
                <span>Customer Name</span>
                <strong>
                  {getValue(selectedEnquiry, "name", "Name") || "—"}
                </strong>
              </div>

              <div>
                <span>Phone Number</span>
                <strong>
                  {getValue(selectedEnquiry, "phone", "Phone") || "—"}
                </strong>
              </div>

              <div>
                <span>Email Address</span>
                <strong>
                  {getValue(selectedEnquiry, "email", "Email") || "—"}
                </strong>
              </div>

              <div>
                <span>Configuration</span>
                <strong>
                  {getValue(
                    selectedEnquiry,
                    "configuration",
                    "Configuration",
                  ) || "—"}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{getStatus(selectedEnquiry)}</strong>
              </div>

              <div>
                <span>Received On</span>
                <strong>
                  {formatDate(
                    getValue(selectedEnquiry, "createdAtUtc", "CreatedAtUtc"),
                  )}
                </strong>
              </div>
            </div>

            <div className="enquiries-message">
              <span>Customer Message</span>
              <p>
                {getValue(selectedEnquiry, "message", "Message") ||
                  "No message provided."}
              </p>
            </div>

            <div className="enquiries-modal-actions">
              {getValue(selectedEnquiry, "phone", "Phone") && (
                <a href={`tel:${getValue(selectedEnquiry, "phone", "Phone")}`}>
                  Call Customer
                </a>
              )}

              {getValue(selectedEnquiry, "email", "Email") && (
                <a
                  href={`mailto:${getValue(selectedEnquiry, "email", "Email")}`}
                >
                  Email Customer
                </a>
              )}

              <button type="button" onClick={() => setSelectedEnquiry(null)}>
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default EnquiriesManagement;
