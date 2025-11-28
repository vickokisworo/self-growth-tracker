import api from "./api";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data.data;
  },

  register: async (username, email, password) => {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    return response.data.data;
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data.data;
  },
};
