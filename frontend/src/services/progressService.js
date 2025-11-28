import api from "./api";

export const progressService = {
  getAll: async (filters = {}) => {
    const response = await api.get("/progress", { params: filters });
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/progress/${id}`);
    return response.data.data;
  },

  create: async (data) => {
    const response = await api.post("/progress", data);
    return response.data.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/progress/${id}`, data);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/progress/${id}`);
    return response.data;
  },
};
