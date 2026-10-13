import axios from "axios";

const DEFAULT_API_URL = "https://vasavi-bhuvi-api.onrender.com/api";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_URL
).replace(/\/+$/, "");

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/i, "");

// Resolve image paths returned by the API.
export const resolveImageUrl = (path) => {
  if (typeof path !== "string" || !path.trim()) {
    return "";
  }

  const value = path.trim();

  // Keep absolute URLs and data/blob URLs unchanged.
  if (/^(https?:)?\/\//i.test(value) || /^(data:|blob:)/i.test(value)) {
    return value.startsWith("//")
      ? `${window.location.protocol}${value}`
      : value;
  }

  // Website images stored in the frontend's public/images folder.
  if (/^\/?images\//i.test(value)) {
    return `/${value.replace(/^\/+/, "")}`;
  }

  // Uploaded images and other API-hosted files.
  return `${API_ORIGIN}/${value.replace(/^\/+/, "")}`;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

export default apiClient;
