import apiClient from "./apiClient";

export const getProjectContent = async () =>
  (await apiClient.get("/Content/project")).data;

export const getFloorPlans = async () =>
  (await apiClient.get("/Content/floor-plans")).data;

export const getAmenities = async () =>
  (await apiClient.get("/Content/amenities")).data;

export const getGalleryImages = async () =>
  (await apiClient.get("/Content/gallery")).data;

export const getSpecifications = async () =>
  (await apiClient.get("/Content/specifications")).data;
