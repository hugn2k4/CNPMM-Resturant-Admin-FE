import axios, { AxiosInstance } from "axios";

/**
 * Chat API Client
 * Connects to Customer Backend (localhost:8080) where chat server is running
 * This is separate from the main API client because chat functionality
 * is hosted on a different backend service
 */
class ChatApiClient {
  private client: AxiosInstance;

  constructor() {
    // Chat API is on Customer Backend, not Admin Backend
    const chatApiUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080";

    this.client = axios.create({
      baseURL: `${chatApiUrl}/api`,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error("[Chat API] Unauthorized - token may be invalid");
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.client.get(url);
    return response.data;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.patch(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete(url);
    return response.data;
  }
}

export const chatApiClient = new ChatApiClient();
