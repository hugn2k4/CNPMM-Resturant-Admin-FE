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
    return apiClient.get<Customer[]>(this.basePath);
  }

  async getCustomerById(id: string): Promise<Customer> {
    return apiClient.get<Customer>(`${this.basePath}/${id}`);
  }

  async updateCustomer(
    id: string,
    data: UpdateCustomerDto
  ): Promise<Customer> {
    return apiClient.put<Customer>(`${this.basePath}/${id}`, data);
  }

  async toggleCustomerStatus(
    id: string,
    status: 'ACTIVE' | 'BLOCKED'
  ): Promise<Customer> {
    return apiClient.patch<Customer>(
      `${this.basePath}/${id}/toggle-status`,
      { status }
    );
  }

  async deleteCustomer(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const customersService = new CustomersService();
