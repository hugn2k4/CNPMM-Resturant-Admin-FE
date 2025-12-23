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
    const response = await apiClient.get(url);
    return response.data;
  },

  // Lấy chi tiết một món ăn
  getDishById: async (id: string): Promise<Dish> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Tạo món ăn mới
  createDish: async (data: CreateDishDto): Promise<Dish> => {
    const response = await apiClient.post('/products', data);
    return response.data;
  },

  // Cập nhật món ăn
  updateDish: async (id: string, data: UpdateDishDto): Promise<Dish> => {
    const response = await apiClient.patch(`/products/${id}`, data);
    return response.data;
  },

  // Xóa món ăn
  deleteDish: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  // Cập nhật trạng thái món ăn
  updateStatus: async (id: string, status: string): Promise<Dish> => {
    const response = await apiClient.patch(`/products/${id}`, { status });
    return response.data;
  },
};
