import { apiClient } from './api-client';

export interface Dish {
  _id: string;
  name: string;
  description: string;
  price: number;
  listProductImage: Array<{ url: string }>;
  listReview: any[];
  status: 'available' | 'unavailable' | 'out-of-stock';
  categoryId: string;
  stock: number;
  preparationTime: string;
  calories: number;
  rating: number;
  reviewCount: number;
  viewCount: number;
  soldCount: number;
  discount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDishDto {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  preparationTime: string;
  calories: number;
  listProductImage?: Array<{ url: string }>;
  discount?: number;
}

export interface UpdateDishDto extends Partial<CreateDishDto> {
  status?: 'available' | 'unavailable' | 'out-of-stock';
}

export const dishesService = {
  // Lấy tất cả món ăn hoặc theo category
  getAllDishes: async (category?: string): Promise<Dish[]> => {
    const url = category ? `/products?category=${category}` : '/products';
    return apiClient.get<Dish[]>(url);
  },

  // Lấy chi tiết một món ăn
  getDishById: async (id: string): Promise<Dish> => {
    return apiClient.get<Dish>(`/products/${id}`);
  },

  // Tạo món ăn mới
  createDish: async (data: CreateDishDto): Promise<Dish> => {
    return apiClient.post<Dish>('/products', data);
  },

  // Cập nhật món ăn
  updateDish: async (id: string, data: UpdateDishDto): Promise<Dish> => {
    return apiClient.patch<Dish>(`/products/${id}`, data);
  },

  // Xóa món ăn
  deleteDish: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  // Cập nhật trạng thái món ăn
  updateStatus: async (id: string, status: string): Promise<Dish> => {
    return apiClient.patch<Dish>(`/products/${id}`, { status });
  },
};
