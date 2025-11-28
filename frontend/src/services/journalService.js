import api from "./api";

export const journalService = {
  getAll: async (limit = 30) => {
    const response = await api.get("/journals", { params: { limit } });
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/journals/${id}`);
    return response.data.data;
  },

  getByDate: async (date) => {
    const response = await api.get(`/journals/date/${date}`);
    return response.data.data;
  },

  create: async (data) => {
    const response = await api.post("/journals", data);
    return response.data.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/journals/${id}`, data);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/journals/${id}`);
    return response.data;
  },
};
