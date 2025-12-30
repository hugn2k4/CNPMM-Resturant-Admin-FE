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

  async register(data: any): Promise<AuthResponse> {
    return apiClient.post("/auth/register", data);
  },

  async sendRegisterOtp(data: any): Promise<any> {
    return apiClient.post("/auth/send-register-otp", data);
  },

  async verifyRegisterOtp(email: string, otp: string): Promise<AuthResponse> {
    return apiClient.post("/auth/verify-register-otp", { email, otp });
  },

  async forgotPassword(email: string): Promise<any> {
    return apiClient.post("/auth/forgot-password", { email });
  },

  async resetPassword(data: any): Promise<any> {
    return apiClient.post("/auth/reset-password", data);
  },
};
