import apiClient from "./client";

export const registerUser = (email, password, fullName) =>
  apiClient.post("/auth/register", {
    email,
    password,
    full_name: fullName,
  });

export const loginUser = (email, password) =>
  apiClient.post("/auth/login", { email, password });

export const getCurrentUser = () => apiClient.get("/auth/me");