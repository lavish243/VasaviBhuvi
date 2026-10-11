import apiClient from "../api/apiClient";

const getAuthConfig = () => {
  const token = localStorage.getItem("vasavi_admin_token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAdminFloorPlans = async () => {
  const response = await apiClient.get("/admin/floor-plans", getAuthConfig());

  return response.data;
};

export const createFloorPlan = async (data) => {
  const response = await apiClient.post(
    "/admin/floor-plans",
    data,
    getAuthConfig(),
  );

  return response.data;
};

export const updateFloorPlan = async (id, data) => {
  const response = await apiClient.put(
    `/admin/floor-plans/${id}`,
    data,
    getAuthConfig(),
  );

  return response.data;
};

export const deleteFloorPlan = async (id) => {
  const response = await apiClient.delete(
    `/admin/floor-plans/${id}`,
    getAuthConfig(),
  );

  return response.data;
};
