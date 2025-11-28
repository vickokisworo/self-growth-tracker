// frontend/src/services/todoService.js
import api from "./api";

export const todoService = {
  getAll: async (filters = {}) => {
    const response = await api.get("/todos", { params: filters });
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/todos/${id}`);
    return response.data.data;
  },

  getStats: async () => {
    const response = await api.get("/todos/stats/summary");
    return response.data.data;
  },

  create: async (data) => {
    const response = await api.post("/todos", data);
    return response.data.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/todos/${id}`, data);
    return response.data.data;
  },

  toggleComplete: async (id) => {
    const response = await api.patch(`/todos/${id}/toggle`);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  },

  deleteCompleted: async () => {
    const response = await api.delete("/todos/completed/all");
    return response.data;
  },
};
