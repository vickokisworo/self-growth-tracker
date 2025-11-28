import api from "./api";

export const habitService = {
  getAll: async () => {
    const response = await api.get("/habits");
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/habits/${id}`);
    return response.data.data;
  },

  create: async (data) => {
    const response = await api.post("/habits", data);
    return response.data.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/habits/${id}`, data);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/habits/${id}`);
    return response.data;
  },

  logHabit: async (id, data) => {
    const response = await api.post(`/habits/${id}/log`, data);
    return response.data.data;
  },

  getLogs: async (id, startDate, endDate) => {
    const response = await api.get(`/habits/${id}/logs`, {
      params: { startDate, endDate },
    });
    return response.data.data;
  },

  getStreak: async (id) => {
    const response = await api.get(`/habits/${id}/streak`);
    return response.data.data;
  },
};
