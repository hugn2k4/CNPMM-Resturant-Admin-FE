import type {
  Order,
  OrderListResponse,
  OrderStatistics,
  QueryOrderParams,
  UpdateOrderStatusRequest,
} from "@/types/order";
import { apiClient } from "./api-client";

export const orderService = {
  // Get all orders with filters and pagination
  async getOrders(params?: QueryOrderParams): Promise<OrderListResponse> {
    return apiClient.get<OrderListResponse>("/orders", { params });
  },

  // Get single order by ID
  async getOrder(id: string): Promise<Order> {
    return apiClient.get<Order>(`/orders/${id}`);
  },

  // Update order status
  async updateOrderStatus(id: string, data: UpdateOrderStatusRequest): Promise<Order> {
    return apiClient.patch<Order>(`/orders/${id}/status`, data);
  },

  // Delete order
  async deleteOrder(id: string): Promise<void> {
    return apiClient.delete<void>(`/orders/${id}`);
  },

  // Get order statistics
  async getStatistics(): Promise<OrderStatistics> {
    return apiClient.get<OrderStatistics>("/orders/statistics");
  },
};
