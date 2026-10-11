import { API_BASE_URL } from "../api/apiClient";

// Get all published page sections
export async function getPageSections(sectionKey = "") {
  const url = new URL(`${API_BASE_URL}/page-sections`);

  if (sectionKey) {
    url.searchParams.set("sectionKey", sectionKey);
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load page sections (${response.status})`);
  }

  return response.json();
}

// Get one published section by its key
export async function getPageSection(sectionKey) {
  const response = await fetch(
    `${API_BASE_URL}/page-sections/${encodeURIComponent(sectionKey)}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to load section (${response.status})`);
  }

  return response.json();
}

// Create a section (Admin only)
export async function createPageSection(section, token) {
  return sendAdminRequest("/admin/page-sections", "POST", section, token);
}

// Update a section (Admin only)
export async function updatePageSection(id, section, token) {
  return sendAdminRequest(
    `/admin/page-sections/${encodeURIComponent(id)}`,
    "PUT",
    section,
    token,
  );
}

// Delete a section (Admin only)
export async function deletePageSection(id, token) {
  const response = await fetch(
    `${API_BASE_URL}/admin/page-sections/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Delete failed (${response.status})`);
  }

  return true;
}

async function sendAdminRequest(path, method, data, token) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getAdminPageSections(token) {
  const response = await fetch(`${API_BASE_URL}/admin/page-sections`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to load admin sections (${response.status})`);
  }

  return response.json();
}
