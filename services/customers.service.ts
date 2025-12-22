import { apiClient } from './api-client';

export interface Customer {
  _id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  status: 'ACTIVE' | 'BLOCKED' | 'INACTIVE';
  authProvider: string;
  isEmailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateCustomerDto {
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  status?: 'ACTIVE' | 'BLOCKED' | 'INACTIVE';
  password?: string;
}

export interface ToggleStatusDto {
  status: 'ACTIVE' | 'BLOCKED';
}

class CustomersService {
  private basePath = '/customers';

  async getAllCustomers(): Promise<Customer[]> {
    const response = await apiClient.get<{ data: Customer[] }>(this.basePath);
    return response.data;
  }

  async getCustomerById(id: string): Promise<Customer> {
    const response = await apiClient.get<{ data: Customer }>(
      `${this.basePath}/${id}`
    );
    return response.data;
  }

  async updateCustomer(
    id: string,
    data: UpdateCustomerDto
  ): Promise<Customer> {
    const response = await apiClient.put<{ data: Customer }>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data;
  }

  async toggleCustomerStatus(
    id: string,
    status: 'ACTIVE' | 'BLOCKED'
  ): Promise<Customer> {
    const response = await apiClient.patch<{ data: Customer }>(
      `${this.basePath}/${id}/toggle-status`,
      { status }
    );
    return response.data;
  }

  async deleteCustomer(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const customersService = new CustomersService();
