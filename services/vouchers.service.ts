import { apiClient } from "./api-client";
import type {
  Voucher,
  CreateVoucherInput,
  UpdateVoucherInput,
  VoucherStatistics,
} from "@/types/voucher";

interface VoucherListResponse {
  data: Voucher[];
  total: number;
  page: number;
  limit: number;
}

export const vouchersService = {
  // Get all vouchers with filters
  async getAll(params?: {
    isActive?: boolean;
    discountType?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<VoucherListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.isActive !== undefined)
      queryParams.append("isActive", String(params.isActive));
    if (params?.discountType)
      queryParams.append("discountType", params.discountType);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));

    return apiClient.get<VoucherListResponse>(
      `/vouchers?${queryParams.toString()}`
    );
  },

  // Get voucher by ID
  async getById(id: string): Promise<Voucher> {
    return apiClient.get<Voucher>(`/vouchers/${id}`);
  },

  // Get voucher by code
  async getByCode(code: string): Promise<Voucher> {
    return apiClient.get<Voucher>(`/vouchers/code/${code}`);
  },

  // Create new voucher
  async create(data: CreateVoucherInput): Promise<Voucher> {
    return apiClient.post<Voucher>("/vouchers", data);
  },

  // Update voucher
  async update(id: string, data: UpdateVoucherInput): Promise<Voucher> {
    return apiClient.patch<Voucher>(`/vouchers/${id}`, data);
  },

  // Delete voucher
  async delete(id: string): Promise<void> {
    return apiClient.delete(`/vouchers/${id}`);
  },

  // Toggle voucher active status
  async toggleActive(id: string): Promise<Voucher> {
    return apiClient.patch<Voucher>(`/vouchers/${id}/toggle-active`, {});
  },

  // Get voucher statistics
  async getStatistics(): Promise<VoucherStatistics> {
    return apiClient.get<VoucherStatistics>("/vouchers/statistics");
  },
};
