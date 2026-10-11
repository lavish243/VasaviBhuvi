import axios from "axios";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://localhost:58389/api"
).replace(/\/+$/, "");
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/i, "");

// Resolve image paths returned by the API. Local website assets (/images/...)
// remain on Vite/the deployed frontend; uploaded files (/uploads/...) come from the API host.
export const resolveImageUrl = (path) => {
  if (typeof path !== "string" || !path.trim()) return "";
  const value = path.trim();
  if (/^(https?:)?\/\//i.test(value) || /^(data:|blob:)/i.test(value)) {
    return value.startsWith("//") ? `${window.location.protocol}${value}` : value;
  }
  if (/^\/?images\//i.test(value)) return `/${value.replace(/^\/+/, "")}`;
  return `${API_ORIGIN}/${value.replace(/^\/+/, "")}`;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: "application/json" },
});

export default apiClient;
