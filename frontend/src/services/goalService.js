import api from "./api";

export const goalService = {
  getAll: async () => {
    const response = await api.get("/goals");
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/goals/${id}`);
    return response.data.data;
  },

  create: async (data) => {
    const response = await api.post("/goals", data);
    return response.data.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/goals/${id}`, data);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },

  addStep: async (goalId, data) => {
    const response = await api.post(`/goals/${goalId}/steps`, data);
    return response.data.data;
  },

  updateStep: async (stepId, completed) => {
    const response = await api.put(`/goals/steps/${stepId}`, { completed });
    return response.data.data;
  },

  deleteStep: async (stepId) => {
    const response = await api.delete(`/goals/steps/${stepId}`);
    return response.data;
  },
};
