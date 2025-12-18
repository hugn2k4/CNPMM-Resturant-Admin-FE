import { AuthResponse, LoginCredentials } from "@/types";
import { apiClient } from "./api-client";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/auth/login", credentials);
  },

  async logout(): Promise<void> {
    return apiClient.post("/auth/logout");
  },

  async getCurrentUser() {
    return apiClient.get("/auth/me");
  },

  async refreshToken(): Promise<{ token: string }> {
    return apiClient.post("/auth/refresh");
  },
};
